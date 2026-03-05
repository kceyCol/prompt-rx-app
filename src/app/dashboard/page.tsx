import { auth } from "@clerk/nextjs/server";
import { getPersona } from "@/app/actions/soap-actions";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
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
                <DashboardTabs persona={persona} />
            </main>
        </div>
    );
}
