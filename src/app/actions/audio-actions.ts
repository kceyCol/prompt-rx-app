"use server";

import { auth } from "@clerk/nextjs/server";
import { transcribeAudio } from "@/lib/ai/gemini";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { z } from "zod";

const ALLOWED_MIME_TYPES = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "audio/ogg",
    "audio/webm",
] as const;

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const audioSchema = z.object({
    size: z.number().max(MAX_FILE_SIZE, "Arquivo deve ter no máximo 25MB"),
    type: z.string().refine(
        (t) => ALLOWED_MIME_TYPES.includes(t as (typeof ALLOWED_MIME_TYPES)[number]),
        "Formato de áudio não suportado. Use MP3, WAV, M4A, OGG ou WebM."
    ),
});

export async function transcribeAudioAction(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const file = formData.get("audio") as File | null;
    if (!file) throw new Error("Nenhum arquivo de áudio enviado.");

    // Validate file
    const validation = audioSchema.safeParse({ size: file.size, type: file.type });
    if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
    }

    // Save temp file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tmpdir(), `audio-${userId}-${Date.now()}-${file.name}`);

    try {
        await writeFile(tempPath, buffer);

        // Transcribe via Gemini
        const transcription = await transcribeAudio(tempPath, file.type);
        return { transcription };
    } finally {
        // Cleanup temp file
        await unlink(tempPath).catch(() => { });
    }
}
