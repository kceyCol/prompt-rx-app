"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptAnalyzer } from "@/components/analyzer/prompt-analyzer";
import { SOAPGenerator } from "@/components/soap/soap-generator";
import { AudioUploader } from "@/components/audio/audio-uploader";
import { PersonaSettings } from "@/components/settings/persona-settings";

interface DashboardTabsProps {
    persona: {
        specialty: string | null;
        experienceYears: number | null;
        toneOfVoice: string | null;
        hospitalContext: string | null;
    } | null;
}

export function DashboardTabs({ persona }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState(persona ? "generator" : "settings");
    const [soapNotes, setSoapNotes] = useState("");

    const handleSendToSOAP = (text: string) => {
        setSoapNotes(text);
        setActiveTab("generator");
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-[700px] grid-cols-4">
                <TabsTrigger value="analyzer">Prompt Analyzer</TabsTrigger>
                <TabsTrigger value="generator">SOAP</TabsTrigger>
                <TabsTrigger value="audio">Áudio</TabsTrigger>
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
                <SOAPGenerator initialNotes={soapNotes} />
            </TabsContent>

            <TabsContent value="audio" className="space-y-6">
                <AudioUploader onSendToSOAP={handleSendToSOAP} />
            </TabsContent>

            <TabsContent value="settings">
                <div className="max-w-2xl">
                    <PersonaSettings initialData={persona} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
