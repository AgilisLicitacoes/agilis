import agilisLogo from "@/assets/agilisnewlogo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "settings", label: "Configurações" },
];

export default function Sidebar({ activeKey = "dashboard" }) {
  return (
    <aside className="hidden w-72 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
          <img src={agilisLogo} alt="Agilis Licitações" className="h-7 w-7 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-tight text-foreground">
            Agilis Licitações
          </div>
          <div className="truncate text-xs text-muted-foreground">Painel da organização</div>
        </div>
      </div>

      <nav className="px-3 pb-4">
        {navItems.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              className={cn(
                "mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">Mariana Costa</div>
            <div className="truncate text-xs text-muted-foreground">Analista de Licitações</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

