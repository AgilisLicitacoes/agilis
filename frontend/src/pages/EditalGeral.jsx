import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { getLicitacaoById } from "@/mocks/licitacoes";

function Spinner({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 animate-spin text-current", className)}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
        fill="none"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.9"
        fill="none"
      />
    </svg>
  );
}

function StatusPill({ tone = "neutral", children, showSpinner = false }) {
  const tones = {
    success:
      "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]",
    warning:
      "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone] ?? tones.neutral,
      )}
    >
      {showSpinner ? <Spinner className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}

function BigStatus({ statusLabel, tone }) {
  const isProcessing = statusLabel === "Processando Edital";
  const bg =
    tone === "success"
      ? "bg-[hsl(var(--success)/0.12)] border-[hsl(var(--success)/0.25)]"
      : tone === "warning"
        ? "bg-[hsl(var(--warning)/0.10)] border-[hsl(var(--warning)/0.25)]"
        : "bg-muted/50 border-border";

  return (
    <div className={cn("rounded-xl border p-5", bg)}>
      <div className="text-xs font-medium text-muted-foreground">Status da IA</div>
      <div className="mt-2 flex items-center gap-3">
        {isProcessing ? <Spinner className="h-5 w-5" /> : null}
        <div className="text-lg font-bold text-foreground">{statusLabel}</div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {isProcessing
          ? "Estamos extraindo e estruturando o edital."
          : "Acompanhe o andamento da extração e acesse os resultados."}
      </div>
    </div>
  );
}

export default function EditalGeral({ licitacaoId, onBack }) {
  const lic = getLicitacaoById(licitacaoId);

  const statusLabel = lic?.status?.label ?? "Desconhecido";
  const isAwaiting = statusLabel === "Aguardando Início";
  const isDone = statusLabel === "Extração Concluída";
  const isProcessing = statusLabel === "Processando Edital";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar activeKey="dashboard" />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-background/80 px-6 py-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" className="h-10" onClick={onBack}>
                    Voltar
                  </Button>
                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold tracking-tight">
                      Tela geral do edital
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Visão geral e acesso rápido à análise e resultados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
              {/* Top half */}
              <div className="grid grid-cols-12 gap-4">
                <section className="col-span-12 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-8">
                  {lic ? (
                    <>
                      <div className="text-xs font-medium text-muted-foreground">
                        Identificador
                      </div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{lic.id}</div>

                      <div className="mt-5">
                        <div className="text-xs font-medium text-muted-foreground">
                          Nome do edital
                        </div>
                        <div className="mt-1 text-lg font-bold leading-snug text-foreground">
                          {lic.title}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-background p-4">
                          <div className="text-xs font-medium text-muted-foreground">UASG</div>
                          <div className="mt-1 text-sm font-semibold text-foreground">
                            {lic.uasg}
                          </div>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-4">
                          <div className="text-xs font-medium text-muted-foreground">Emissor</div>
                          <div className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                            {lic.emissor}
                          </div>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-4">
                          <div className="text-xs font-medium text-muted-foreground">
                            Data de publicação
                          </div>
                          <div className="mt-1 text-sm font-semibold text-foreground">
                            {lic.publishedAt}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button type="button" className="h-11" disabled={!isAwaiting}>
                          ANALISAR
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11"
                          disabled={!isDone}
                        >
                          VER RESULTADOS
                        </Button>
                        <div className="ml-auto flex items-center gap-2">
                          <StatusPill
                            tone={lic.status.tone}
                            showSpinner={isProcessing}
                          >
                            {lic.status.label}
                          </StatusPill>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-background p-6">
                      <div className="text-sm font-semibold text-foreground">
                        Edital não encontrado
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Não achei dados para o id <span className="font-mono">{licitacaoId}</span>.
                      </div>
                      <div className="mt-4">
                        <Button type="button" variant="outline" onClick={onBack}>
                          Voltar pro dashboard
                        </Button>
                      </div>
                    </div>
                  )}
                </section>

                <aside className="col-span-12 lg:col-span-4">
                  <BigStatus statusLabel={statusLabel} tone={lic?.status?.tone ?? "neutral"} />
                  <div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="text-xs font-medium text-muted-foreground">
                      Atalhos rápidos
                    </div>
                    <div className="mt-3 grid gap-2">
                      <Button type="button" variant="ghost" className="justify-start" disabled>
                        Ver histórico (em breve)
                      </Button>
                      <Button type="button" variant="ghost" className="justify-start" disabled>
                        Exportar (em breve)
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Bottom half */}
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">PDF do edital</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Por enquanto vazio. Depois o backend vai consolidar os uploads em um PDF único.
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-[520px] rounded-lg border border-dashed border-border bg-background">
                  <div className="flex h-full items-center justify-center px-6 text-center">
                    <div className="max-w-md">
                      <div className="text-sm font-semibold text-foreground">
                        Visualizador de PDF (placeholder)
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Aqui vai aparecer o PDF consolidado quando tiver backend.
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

