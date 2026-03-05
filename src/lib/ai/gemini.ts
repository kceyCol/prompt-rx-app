import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
