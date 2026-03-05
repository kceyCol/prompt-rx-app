"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, clinicalCases, soapEvolutions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSOAP as aiGenerateSOAP } from "@/lib/ai/gemini";
import { revalidatePath } from "next/cache";

export async function getPersona() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user || null;
}

export async function savePersona(data: {
    specialty: string;
    experienceYears: number;
    toneOfVoice: string;
    hospitalContext?: string;
}) {
    const { userId, sessionClaims } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const email = sessionClaims?.email as string || "unknown@example.com";

    await db.insert(users).values({
        id: userId,
        email,
        ...data,
    }).onConflictDoUpdate({
        target: users.id,
        set: data,
    });

    revalidatePath("/dashboard");
}

export async function createSOAP(rawNotes: string, patientInfo?: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getPersona();
    if (!user) throw new Error("Persona not configured. Please set your specialty and experience first.");

    // 1. Chamar a IA com o Método C-I-D
    const soapResult = await aiGenerateSOAP({
        persona: {
            specialty: user.specialty!,
            experienceYears: user.experienceYears!,
            toneOfVoice: user.toneOfVoice!,
            hospitalContext: user.hospitalContext ?? undefined,
        },
        rawNotes,
        patientInfo,
    });

    // 2. Salvar o Caso Clínico (Isolado por userId)
    const caseId = crypto.randomUUID();
    await db.insert(clinicalCases).values({
        id: caseId,
        userId,
        rawNotes,
        patientAge: 0, // Mocked for now or extracted from patientInfo
        patientGender: "unknown",
    });

    // 3. Salvar a Evolução SOAP
    const soapId = crypto.randomUUID();
    await db.insert(soapEvolutions).values({
        id: soapId,
        caseId,
        ...soapResult,
    });

    revalidatePath("/dashboard");
    return soapResult;
}
