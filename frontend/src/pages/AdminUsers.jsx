import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/session/SessionProvider";

function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export default function AdminUsers({ onBack }) {
  const { token, logout } = useSession();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/admin/users?approved=false", {
        token,
        method: "GET"
      });
      setUsers(data.users ?? []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const pendingCount = useMemo(() => users.filter((u) => !u.approved).length, [users]);

  async function approve(uid) {
    await apiFetch(`/api/admin/users/${uid}/approve`, { token, method: "POST" });
    await load();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar activeKey="settings" />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-background/80 px-6 py-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight">Aprovação de usuários</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pendentes: <span className="font-semibold text-foreground">{pendingCount}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="h-10" onClick={onBack}>
                  Voltar
                </Button>
                <Button type="button" variant="outline" className="h-10" onClick={() => void load()}>
                  Recarregar
                </Button>
                <Button type="button" variant="outline" className="h-10" onClick={() => void logout()}>
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            <div className="mx-auto w-full max-w-6xl">
              {error ? (
                <div className="rounded-md border border-border bg-card p-4 text-sm">
                  <div className="font-semibold">Erro</div>
                  <div className="mt-1 text-muted-foreground">{String(error.message ?? error)}</div>
                </div>
              ) : null}

              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <div className="text-sm font-semibold">Usuários pendentes</div>
                  <div className="text-xs text-muted-foreground">{loading ? "Carregando..." : ""}</div>
                </div>

                {users.length === 0 && !loading ? (
                  <div className="px-5 py-6 text-sm text-muted-foreground">Nenhum usuário pendente.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {users.map((u) => (
                      <div key={u.uid} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{u.fullName || "-"}</div>
                          <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            Criado: {formatDate(u.createdAt)} | Último login: {formatDate(u.lastLoginAt)}
                          </div>
                        </div>
                        <Button type="button" className="h-10" onClick={() => void approve(u.uid)}>
                          Aprovar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

