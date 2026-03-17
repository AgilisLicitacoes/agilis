import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Agilis Frontend
          </h1>
          <p className="text-muted-foreground">
            Estrutura inicial em React + shadcn/ui.
          </p>
        </div>
        <Button onClick={() => setCount((c) => c + 1)}>
          Clique de teste ({count})
        </Button>
      </div>
    </div>
  );
}

export default App;

