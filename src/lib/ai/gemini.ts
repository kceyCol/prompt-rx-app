import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

export async function generateSOAP({
    persona,
    rawNotes,
    patientInfo,
}: {
    persona: {
        specialty: string;
        experienceYears: number;
        toneOfVoice: string;
        hospitalContext?: string;
    };
    rawNotes: string;
    patientInfo?: string;
}) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Método C-I-D (Contexto, Instrução, Dados)
    const prompt = `
### C - Contexto ###
Você é um ${persona.specialty} com ${persona.experienceYears} anos de experiência. 
Seu tom de voz deve ser ${persona.toneOfVoice}. 
Contexto hospitalar: ${persona.hospitalContext || "Consultório Geral"}.
Você é um assistente de documentação médica focado em precisão técnica e clareza clínica.

### I - Instrução ###
Transforme as notas brutas em uma evolução clínica estruturada no formato SOAP (Subjective, Objective, Assessment, Plan). 
Use terminologia médica técnica. 
Se algum dado estiver faltando (como exame físico), coloque "[Não informado]".
Siga as diretrizes de segurança: não invente informações (alucinações). Se os dados forem insuficientes, aponte as lacunas.
A saída deve ser em JSON com os campos: subjective, objective, assessment, plan, e fullMarkdown.

### D - Dados ###
Informações do Paciente: ${patientInfo || "Não identificado"}
Notas Brutas: 
"""
${rawNotes}
"""

Retorne apenas o JSON.
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpeza básica para garantir que o JSON seja parseado (caso a IA retorne markdown blocks)
    const jsonString = text.replace(/```json\n?|```/g, "").trim();

    const parsedJson = JSON.parse(jsonString);

    // Ensure all fields are strings to prevent "[object Object]" errors in DB
    return {
        subjective: typeof parsedJson.subjective === 'string' ? parsedJson.subjective : JSON.stringify(parsedJson.subjective),
        objective: typeof parsedJson.objective === 'string' ? parsedJson.objective : JSON.stringify(parsedJson.objective),
        assessment: typeof parsedJson.assessment === 'string' ? parsedJson.assessment : JSON.stringify(parsedJson.assessment),
        plan: typeof parsedJson.plan === 'string' ? parsedJson.plan : JSON.stringify(parsedJson.plan),
        fullMarkdown: typeof parsedJson.fullMarkdown === 'string' ? parsedJson.fullMarkdown : JSON.stringify(parsedJson.fullMarkdown) || "",
    };
}

export async function transcribeAudio(filePath: string, mimeType: string): Promise<string> {
    const uploadResult = await fileManager.uploadFile(filePath, {
        mimeType,
        displayName: "audio-transcription",
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri,
            },
        },
        {
            text: `Transcreva o áudio acima com precisão médica. 
Regras:
- Mantenha toda a terminologia médica exatamente como falada.
- Use pontuação adequada para facilitar leitura.
- Separe por parágrafos quando houver pausas longas ou mudança de assunto.
- NÃO invente informações. Transcreva apenas o que é dito.
- Se algum trecho estiver inaudível, marque como [inaudível].
- Retorne APENAS o texto da transcrição, sem formatação adicional.`,
        },
    ]);

    const response = await result.response;
    return response.text();
}
