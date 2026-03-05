import { auth } from "@clerk/nextjs/server";
import { getPersona } from "@/app/actions/soap-actions";
import { SOAPGenerator } from "@/components/soap/soap-generator";
import { PersonaSettings } from "@/components/settings/persona-settings";
import { PromptAnalyzer } from "@/components/analyzer/prompt-analyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
    const { userId } = await auth();
    const persona = await getPersona();

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded">CID</span>
                        <span>Medical AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserButton signInUrl="/" />
                    </div>
                </div>
            </header>

            <main className="container max-w-7xl mx-auto p-4 md:p-8">
                <Tabs defaultValue={persona ? "generator" : "settings"} className="space-y-6">
                    <TabsList className="grid w-full max-w-[600px] grid-cols-3">
                        <TabsTrigger value="analyzer">Prompt Analyzer</TabsTrigger>
                        <TabsTrigger value="generator">Gerador SOAP</TabsTrigger>
                        <TabsTrigger value="settings">Configurações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analyzer" className="space-y-6">
                        <PromptAnalyzer />
                    </TabsContent>

                    <TabsContent value="generator" className="space-y-6">
                        {!persona && (
                            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                                ⚠️ Você ainda não configurou sua persona clínica. Vá para a aba <strong>Configurações</strong> primeiro.
                            </div>
                        )}
                        <SOAPGenerator />
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="max-w-2xl">
                            <PersonaSettings initialData={persona} />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
