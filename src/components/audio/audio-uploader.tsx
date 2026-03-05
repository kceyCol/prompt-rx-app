"use client";

import { useState, useRef, useCallback } from "react";
import { transcribeAudioAction } from "@/app/actions/audio-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, FileAudio, X, Copy, Check, ArrowRight } from "lucide-react";

const ACCEPTED_TYPES = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "audio/ogg",
    "audio/webm",
];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AudioUploaderProps {
    onSendToSOAP?: (text: string) => void;
}

export function AudioUploader({ onSendToSOAP }: AudioUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((selectedFile: File) => {
        setError(null);
        setTranscription(null);

        if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
            setError("Formato não suportado. Use MP3, WAV, M4A, OGG ou WebM.");
            return;
        }

        if (selectedFile.size > 25 * 1024 * 1024) {
            setError("Arquivo muito grande. O limite é 25MB.");
            return;
        }

        setFile(selectedFile);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }, [handleFile]);

    const handleTranscribe = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("audio", file);

            const result = await transcribeAudioAction(formData);
            setTranscription(result.transcription);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao transcrever áudio.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setTranscription(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const copyToClipboard = () => {
        if (!transcription) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(transcription);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = transcription;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Falha ao copiar", err);
            }
            document.body.removeChild(textArea);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Upload Card */}
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Upload de Áudio</CardTitle>
                    <CardDescription>
                        Envie um arquivo de áudio para transcrição automática via IA.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*"
                        className="hidden"
                        id="audio-upload-input"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(f);
                        }}
                    />

                    {!file ? (
                        <div
                            className={`
                                relative flex flex-col items-center justify-center gap-3
                                min-h-[250px] rounded-lg border-2 border-dashed
                                transition-colors cursor-pointer
                                ${dragOver
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                                }
                            `}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm">
                                    Arraste e solte ou clique para selecionar
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    MP3, WAV, M4A, OGG, WebM — máx. 25MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 rounded-lg border p-4 bg-muted/30">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileAudio className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900">
                            {error}
                        </div>
                    )}

                    <Button
                        className="w-full"
                        disabled={!file || loading}
                        onClick={handleTranscribe}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Transcrevendo com Gemini...
                            </>
                        ) : (
                            <>
                                <FileAudio className="mr-2 h-4 w-4" />
                                Transcrever Áudio
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Result Card */}
            <Card className="min-h-[400px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle>Transcrição</CardTitle>
                        <CardDescription>Resultado da transcrição via IA.</CardDescription>
                    </div>
                    {transcription && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copiar transcrição">
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                            {onSendToSOAP && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onSendToSOAP(transcription)}
                                    title="Enviar para gerador SOAP"
                                >
                                    SOAP
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </CardHeader>
                <CardContent className="flex-1">
                    {!transcription ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg min-h-[250px]">
                            <div className="text-center space-y-2">
                                <FileAudio className="h-8 w-8 mx-auto opacity-40" />
                                <p className="text-sm">Envie um áudio para ver a transcrição aqui.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed rounded-lg bg-muted/30 p-4 border">
                                {transcription}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
