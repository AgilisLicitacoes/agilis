import { useId, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ArrowLeftIcon({ className }) {
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
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function FileTextIcon({ className }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const shown = unit === 0 ? String(Math.round(value)) : value.toFixed(value >= 10 ? 1 : 2);
  return `${shown} ${units[unit]}`;
}

function isPdf(file) {
  const name = String(file?.name ?? "").toLowerCase();
  return file?.type === "application/pdf" || name.endsWith(".pdf");
}

export default function NewLicitacao({ onBack }) {
  const nameId = useId();
  const [nome, setNome] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const totalCount = files.length;
  const canAddMore = totalCount < 10;

  const summary = useMemo(() => {
    if (totalCount === 0) return "Nenhum arquivo ainda.";
    if (totalCount === 1) return "1 arquivo adicionado.";
    return `${totalCount} arquivos adicionados.`;
  }, [totalCount]);

  function addFiles(fileList) {
    const incoming = Array.from(fileList ?? []).filter(Boolean);
    const onlyPdf = incoming.filter(isPdf);
    const next = [...files];

    for (const f of onlyPdf) {
      if (next.length >= 10) break;
      const key = `${f.name}:${f.size}:${f.lastModified}`;
      const exists = next.some((x) => x.key === key);
      if (!exists) next.push({ key, file: f });
    }
    setFiles(next);
  }

  function onInputChange(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }

  function removeFile(key) {
    setFiles((prev) => prev.filter((x) => x.key !== key));
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar activeKey="dashboard" />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-background/80 px-6 py-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10"
                    onClick={onBack}
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <h1 className="truncate text-2xl font-bold tracking-tight">Nova Licitação</h1>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crie uma nova licitação e envie os editais em PDF para processamento.
                </p>
              </div>

              <Button type="button" className="h-11" onClick={() => {}}>
                Criar Licitação
              </Button>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            <div className="mx-auto w-full max-w-6xl space-y-6">
              <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-2">
                  <label htmlFor={nameId} className="text-sm font-semibold text-foreground">
                    NOME
                  </label>
                  <input
                    id={nameId}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Pregão Eletrônico 90006/2025"
                    className={cn(
                      "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                    )}
                  />
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-foreground">
                    Coloque aqui todos os arquivos editais da licitacao
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Aceita apenas PDF (máximo de 10 arquivos).
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <div
                      className={cn(
                        "rounded-lg border border-dashed p-5 transition-colors",
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background",
                      )}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                      }}
                      onDrop={onDrop}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">
                              Arraste e solte seus PDFs aqui
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ou selecione do seu computador
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <label
                            className={cn(
                              "inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors",
                              "h-10 px-4 py-2",
                              canAddMore
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed",
                            )}
                          >
                            Selecionar PDFs
                            <input
                              type="file"
                              accept="application/pdf,.pdf"
                              multiple
                              disabled={!canAddMore}
                              onChange={onInputChange}
                              className="hidden"
                            />
                          </label>

                          <div className="text-xs text-muted-foreground">{summary}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <div className="text-sm font-semibold text-foreground">Arquivos enviados</div>
                      <div className="text-xs text-muted-foreground">
                        {totalCount}/10
                      </div>
                    </div>

                    {files.length === 0 ? (
                      <div className="px-4 py-4 text-sm text-muted-foreground">
                        Nenhum arquivo enviado ainda.
                      </div>
                    ) : (
                      <ul className="divide-y divide-border">
                        {files.map(({ key, file }) => (
                          <li key={key} className="flex items-center justify-between gap-3 px-4 py-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-foreground">
                                {file.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatBytes(file.size)}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => removeFile(key)}
                            >
                              Remover
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
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

