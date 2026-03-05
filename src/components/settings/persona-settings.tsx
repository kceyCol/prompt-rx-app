"use client";

import { useState } from "react";
import { savePersona } from "@/app/actions/soap-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export function PersonaSettings({ initialData }: { initialData?: any }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            specialty: formData.get("specialty") as string,
            experienceYears: parseInt(formData.get("experienceYears") as string),
            toneOfVoice: formData.get("toneOfVoice") as string,
            hospitalContext: formData.get("hospitalContext") as string,
        };

        try {
            await savePersona(data);
            alert("Configurações salvas. Sua persona clínica foi atualizada.");
        } catch (error) {
            alert("Erro ao salvar. Ocorreu um problema ao atualizar sua persona.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sua Identidade Clínica</CardTitle>
                <CardDescription>Configure como a IA deve se comportar ao gerar documentos.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="specialty">Especialidade</Label>
                        <Input id="specialty" name="specialty" defaultValue={initialData?.specialty} placeholder="Ex: Cardiologista, Pediatra" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="experienceYears">Anos de Experiência</Label>
                        <Input id="experienceYears" name="experienceYears" type="number" defaultValue={initialData?.experienceYears} placeholder="Ex: 15" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="toneOfVoice">Tom de Voz</Label>
                        <Input id="toneOfVoice" name="toneOfVoice" defaultValue={initialData?.toneOfVoice} placeholder="Ex: Formal, Acolhedor, Técnico" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="hospitalContext">Contexto Hospitalar (Opcional)</Label>
                        <Input id="hospitalContext" name="hospitalContext" defaultValue={initialData?.hospitalContext} placeholder="Ex: Hospital Terciário, Clínica Particular" />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Configurações"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
