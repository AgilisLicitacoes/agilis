import { useState } from "react";
import Auth from "./pages/Auth";
import Paywall from "./pages/Paywall";

function App() {
  const [screen, setScreen] = useState("auth"); // "auth" | "paywall"

  return (
    <div className="min-h-screen">
      <div className="fixed left-4 top-4 z-50">
        <button
          type="button"
          onClick={() =>
            setScreen((s) => (s === "auth" ? "paywall" : "auth"))
          }
          className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Testar outra página
        </button>
      </div>

      {screen === "auth" ? <Auth /> : <Paywall />}
    </div>
  );
}

export default App;

