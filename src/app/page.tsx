import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-2xl tracking-tighter">CID Medical AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sign-in">
            Entrar
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sign-up">
            Criar Conta
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  O Novo Estetoscópio Digital para Médicos
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Automatize sua documentação clínica com o Método C-I-D. Transforme notas brutas em evoluções SOAP precisas em segundos.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/sign-up">Começar Agora</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/sign-in">Acesse sua Conta</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-slate-100 p-4 rounded-xl border bg-white shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-xl font-bold">Método C-I-D</h2>
                <p className="text-sm text-gray-500 text-center">
                  Contexto, Instrução e Dados. A estrutura perfeita para prompts médicos infalíveis.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-slate-100 p-4 rounded-xl border bg-white shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h2 className="text-xl font-bold">Segurança & LGPD</h2>
                <p className="text-sm text-gray-500 text-center">
                  Filtros automáticos para desidentificação de pacientes e mitigação de alucinações.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-slate-100 p-4 rounded-xl border bg-white shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 className="text-xl font-bold">Ganhe Tempo</h2>
                <p className="text-sm text-gray-500 text-center">
                  Reduza o tempo de preenchimento de prontuários e foque no que importa: o paciente.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-light text-xs">
        <p className="text-gray-500 dark:text-gray-400">© 2025 CID Medical AI. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="hover:underline underline-offset-4" href="#">Privacidade</Link>
          <Link className="hover:underline underline-offset-4" href="#">Termos</Link>
        </nav>
      </footer>
    </div>
  );
}
