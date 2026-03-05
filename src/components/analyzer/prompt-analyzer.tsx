"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { analyzePrompt } from "@/app/actions/analyzer-actions";
import { FRAMEWORKS } from "@/lib/frameworks";

export function PromptAnalyzer() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    async function handleAnalyze(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const userInput = formData.get("intent") as string;

        try {
            const analysis = await analyzePrompt(userInput);
            setResult(analysis);
        } catch (error: any) {
            alert(error.message || "Erro ao analisar o prompt.");
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        if (!result) return;

        const textToCopy = result.generatedPrompt;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch (err) { }
            document.body.removeChild(textArea);
        }

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* INPUT CARD */}
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Analisador de Intenção Clínica</CardTitle>
                    <CardDescription>Descreva o que você precisa que a IA faça. Nós escolheremos o melhor Framework Médico para você.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAnalyze} className="space-y-4">
                        <Textarea
                            name="intent"
                            placeholder="Ex: Preciso resumir este artigo sobre hipertensão para dar uma aula aos residentes amanhã."
                            className="min-h-[150px]"
                            required
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analisando Framework...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Descobrir Prompt Ideal
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* OUTPUT CARD */}
            <Card className="min-h-[400px] flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle>Framework Recomendado</CardTitle>
                    <CardDescription>O sistema estruturou sua ideia baseada nas melhores práticas (PromptRx).</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                    {!result ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-6 text-center">
                            Descreva sua necessidade ao lado para ver a mágica acontecer.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* METADATA */}
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-blue-700">
                                        {result.selectedFramework}
                                    </h3>
                                    <span className="text-xs bg-slate-200 px-2 py-1 rounded-full uppercase font-medium">
                                        {result.category}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 mb-2">
                                    {FRAMEWORKS[result.selectedFramework]?.name || result.selectedFramework} - {FRAMEWORKS[result.selectedFramework]?.acronym}
                                </p>
                                <p className="text-sm text-slate-500 italic">
                                    "{result.justification}"
                                </p>
                            </div>

                            {/* PROMPT GERADO */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-sm">Prompt Estruturado:</h4>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
                                        {copied ? <Check className="h-3 w-3 mr-2 text-green-500" /> : <Copy className="h-3 w-3 mr-2" />}
                                        Copiar Prompt
                                    </Button>
                                </div>
                                <Textarea
                                    readOnly
                                    value={result.generatedPrompt}
                                    className="min-h-[250px] font-mono text-xs bg-slate-50"
                                />
                            </div>

                            {/* ALTERNATIVAS */}
                            {result.alternativeFrameworks && result.alternativeFrameworks.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold">Alternativas:</span> {result.alternativeFrameworks.join(", ")}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
