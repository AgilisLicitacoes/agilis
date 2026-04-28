import { useState } from "react";
import Auth from "./pages/Auth";
import Paywall from "./pages/Paywall";
import Dashboard from "./pages/Dashboard";
import NewLicitacao from "./pages/NewLicitacao";
import EditalGeral from "./pages/EditalGeral";
import AdminUsers from "./pages/AdminUsers";
import { useSession } from "./session/SessionProvider";

function App() {
  const { loading, isLoggedIn, isApproved, isAdmin } = useSession();
  const [screen, setScreen] = useState("dashboard"); // "dashboard" | "newLicitacao" | "editalGeral" | "adminUsers"
  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Carregando sessão...</div>
      </div>
    );
  }

  if (!isLoggedIn) return <Auth />;
  if (!isApproved) return <Paywall />;

  return (
    <div className="min-h-screen">
      {screen === "dashboard" ? (
        <Dashboard
          onNewLicitacao={() => setScreen("newLicitacao")}
          onOpenEdital={(id) => {
            setSelectedLicitacaoId(id);
            setScreen("editalGeral");
          }}
          onOpenAdminUsers={isAdmin ? () => setScreen("adminUsers") : undefined}
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
      ) : screen === "adminUsers" ? (
        <AdminUsers onBack={() => setScreen("dashboard")} />
      ) : (
        <Dashboard
          onNewLicitacao={() => setScreen("newLicitacao")}
          onOpenEdital={(id) => {
            setSelectedLicitacaoId(id);
            setScreen("editalGeral");
          }}
          onOpenAdminUsers={isAdmin ? () => setScreen("adminUsers") : undefined}
        />
      )}
    </div>
  );
}

export default App;

