import { Button } from "@/components/ui/button";

function Paywall() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="flex w-full max-w-xl flex-col items-center">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-base font-bold">A</span>
          </div>
          <span className="whitespace-nowrap text-2xl font-bold tracking-tight">
            Agilis Licitações
          </span>
        </header>

        <main className="w-full rounded-lg border border-border bg-card p-8 shadow-sm">
          <div className="inline-flex h-7 items-center rounded-xl bg-warning px-3 text-[13px] font-medium text-warning-foreground">
            Aguardando aprovação
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
              Você ainda não é um usuário aprovado
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Seu acesso à plataforma está pendente. Entre em contato com a
              equipe Agilis para concluir a contratação de um de nossos planos e
              liberar sua conta.
            </p>
          </div>

          <section className="mt-6 space-y-2 rounded-md bg-secondary p-4">
            <span className="text-xs font-medium text-muted-foreground">
              Contato para aprovação
            </span>
            <div className="break-words text-sm font-semibold text-foreground">
              aprovacao@agilislicitacoes.com
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nossa equipe poderá orientar você sobre os planos disponíveis e
              ativar seu acesso.
            </p>
          </section>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              className="h-11 w-full"
              type="button"
              // TODO: adicionar lógica (mailto ou ação no app) depois
            >
              Enviar e-mail para aprovação
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Voltar para o login
            </Button>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Se você acredita que isso é um engano, fale com o administrador da
            sua organização.
          </p>
        </main>
      </div>
    </div>
  );
}

export default Paywall;

