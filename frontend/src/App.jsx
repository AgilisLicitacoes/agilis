import { useState } from "react";
import Auth from "./pages/Auth";
import Paywall from "./pages/Paywall";
import Dashboard from "./pages/Dashboard";
import NewLicitacao from "./pages/NewLicitacao";
import EditalGeral from "./pages/EditalGeral";

function App() {
  const [screen, setScreen] = useState("dashboard"); // "auth" | "paywall" | "dashboard" | "newLicitacao"
  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState(null);

  return (
    <div className="min-h-screen">
      <div className="fixed left-4 top-4 z-50">
        <button
          type="button"
          onClick={() =>
            setScreen((s) =>
              s === "auth" ? "dashboard" : s === "dashboard" ? "paywall" : "auth",
            )
          }
          className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Testar outra página
        </button>
      </div>

      {screen === "auth" ? (
        <Auth />
      ) : screen === "dashboard" ? (
        <Dashboard
          onNewLicitacao={() => setScreen("newLicitacao")}
          onOpenEdital={(id) => {
            setSelectedLicitacaoId(id);
            setScreen("editalGeral");
          }}
        />
      ) : screen === "editalGeral" ? (
        <EditalGeral
          licitacaoId={selectedLicitacaoId}
          onBack={() => {
            setSelectedLicitacaoId(null);
            setScreen("dashboard");
          }}
        />
      ) : screen === "newLicitacao" ? (
        <NewLicitacao onBack={() => setScreen("dashboard")} />
      ) : (
        <Paywall />
      )}
    </div>
  );
}

export default App;

