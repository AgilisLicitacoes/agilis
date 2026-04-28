import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { licitacoesMock } from "@/mocks/licitacoes";

function EyeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function ClickableRowArea({ onClick, children, className, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "hover:bg-accent/50 transition-colors",
        className,
      )}
      title={title}
    >
      {children}
    </button>
  );
}

function StatusPill({ tone = "neutral", children }) {
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
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone] ?? tones.neutral,
      )}
    >
      {children}
    </span>
  );
}

function LicitacoesTable({ onOpenEdital }) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="grid grid-cols-12 gap-3 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground">
        <div className="col-span-6">Edital e Órgão</div>
        <div className="col-span-2">Data de Publicação</div>
        <div className="col-span-3">Status da IA</div>
        <div className="col-span-1 text-right">Ações</div>
      </div>

      <div className="divide-y divide-border">
        {licitacoesMock.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-12 items-center gap-3 px-5 py-4"
          >
            <div className="col-span-6 min-w-0">
              <ClickableRowArea
                onClick={() => onOpenEdital?.(row.id)}
                title="Abrir tela geral do edital"
                className="px-2 py-1 -mx-2"
              >
                <div className="truncate text-sm font-semibold text-foreground">
                  {row.title}
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex-shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    UASG: {row.uasg}
                  </span>
                  <div className="min-w-0 truncate text-xs text-muted-foreground">
                    {row.emissor}
                  </div>
                </div>
              </ClickableRowArea>
            </div>

            <div className="col-span-2 text-sm text-foreground">{row.publishedAt}</div>

            <div className="col-span-3">
              <StatusPill tone={row.status.tone}>{row.status.label}</StatusPill>
            </div>

            <div className="col-span-1 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Ver"
                title="Ver"
                onClick={() => onOpenEdital?.(row.id)}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md text-destructive hover:text-destructive"
                aria-label="Excluir"
                title="Excluir"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ onNewLicitacao, onOpenEdital }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar activeKey="dashboard" />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-background/80 px-6 py-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight">
                  Licitações
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acompanhe e extraia dados de editais automaticamente com IA.
                </p>
              </div>

              <Button type="button" className="h-11" onClick={onNewLicitacao}>
                + Nova Licitação
              </Button>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            <div className="mx-auto w-full max-w-6xl">
              <LicitacoesTable onOpenEdital={onOpenEdital} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

