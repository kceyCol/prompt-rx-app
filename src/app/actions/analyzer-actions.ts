"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPersona } from "./soap-actions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzePrompt(userInput: string) {
    if (!userInput || userInput.trim() === "") throw new Error("Entrada vazia.");

    const user = await getPersona();
    const specialtyInfo = user ? `Sou um ${user.specialty} com ${user.experienceYears} anos de exp.` : "Não configurado.";

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const prompt = `
Você é o motor de inteligência do PromptRx, um especialista em engenharia de prompt para médicos.

Seu trabalho é:
1. Analisar a intenção clínica do usuário: "${userInput}"
2. O usuário atual é: ${specialtyInfo}
3. Selecionar o MELHOR framework entre estes: CID, RACE, TRACE, ERA, APE, TAE, CARE, RISE, ROSES, COAST, COT, MEGA.
4. Gerar o prompt clínico estruturado que o sistema deve usar a partir de hoje.
5. Explicar brevemente (justification) porque você escolheu esse framework.

REGRAS:
- documentation -> CID, RACE
- communication -> APE, RACE
- clinical decision -> COT, RISE
- research -> TRACE, TAE
- education -> COAST, RISE
- management -> ROSES, ERA
- pharmacology -> CARE, CID
- automation -> MEGA

FORMATO DE SAÍDA (Apenas JSON):
{
  "category": "string (ex: documentation)",
  "selectedFramework": "string (Apenas a SIGLA, ex: CID)",
  "justification": "string (Explicação curta)",
  "generatedPrompt": "string (O prompt detalhado usando as tags do framework)",
  "alternativeFrameworks": ["SIGLA1", "SIGLA2"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonString = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(jsonString);
}
