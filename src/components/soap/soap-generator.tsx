"use client";

import { useState, useEffect } from "react";
import { createSOAP } from "@/app/actions/soap-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, Check } from "lucide-react";

interface SOAPGeneratorProps {
    initialNotes?: string;
}

export function SOAPGenerator({ initialNotes = "" }: SOAPGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        if (initialNotes) setNotes(initialNotes);
    }, [initialNotes]);

    async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const notes = formData.get("notes") as string;

        try {
            const soap = await createSOAP(notes);
            setResult(soap);
        } catch (error: any) {
            alert(error.message || "Erro ao gerar SOAP");
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        if (!result) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(result.fullMarkdown);
        } else {
            // Fallback for older browsers or non-secure contexts (http:// IP addresses)
            const textArea = document.createElement("textarea");
            textArea.value = result.fullMarkdown;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Falha ao copiar', err);
            }
            document.body.removeChild(textArea);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Entrada de Dados</CardTitle>
                    <CardDescription>Insira suas notas brutas do atendimento (Método C-I-D).</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <Textarea
                            name="notes"
                            placeholder="Ex: Paciente João, 54 anos. Dor no peito tipo queimação..."
                            className="min-h-[300px]"
                            required
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando com Gemini...
                                </>
                            ) : (
                                "Gerar Evolução SOAP"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="min-h-[500px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle>Resultado SOAP</CardTitle>
                        <CardDescription>Evolução estruturada pela IA.</CardDescription>
                    </div>
                    {result && (
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1">
                    {!result ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            Aguardando entrada de dados...
                        </div>
                    ) : (
                        <Tabs defaultValue="formatted" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="formatted">Formatado</TabsTrigger>
                                <TabsTrigger value="raw">Markdown Bruto</TabsTrigger>
                            </TabsList>
                            <TabsContent value="formatted" className="space-y-4 mt-4">
                                <section>
                                    <h4 className="font-bold text-primary">Subjective</h4>
                                    <p className="text-sm whitespace-pre-wrap">{result.subjective}</p>
                                </section>
                                <section>
                                    <h4 className="font-bold text-primary">Objective</h4>
                                    <p className="text-sm whitespace-pre-wrap">{result.objective}</p>
                                </section>
                                <section>
                                    <h4 className="font-bold text-primary">Assessment</h4>
                                    <p className="text-sm whitespace-pre-wrap">{result.assessment}</p>
                                </section>
                                <section>
                                    <h4 className="font-bold text-primary">Plan</h4>
                                    <p className="text-sm whitespace-pre-wrap">{result.plan}</p>
                                </section>
                            </TabsContent>
                            <TabsContent value="raw" className="mt-4">
                                <Textarea
                                    readOnly
                                    value={result.fullMarkdown}
                                    className="min-h-[350px] font-mono text-xs"
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
