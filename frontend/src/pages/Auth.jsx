import { useState } from "react";
import { Button } from "@/components/ui/button";

function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-bold">A</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Agilis Licitações
          </span>
        </header>

        <main className="w-full rounded-lg border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex rounded-md bg-muted p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-sm px-3 py-2 ${
                isLogin
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-sm px-3 py-2 ${
                !isLogin
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm switchToLogin={() => setMode("login")} />
          )}
        </main>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder }) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
    </div>
  );
}

function LoginForm() {
  return (
    <>
      <Field label="E-mail" type="email" placeholder="seuemail@empresa.com.br" />

      <PasswordField />

      <Button className="mt-2 w-full" type="button">
        Entrar na plataforma
      </Button>

      <HelperText />
    </>
  );
}

function SignupForm({ switchToLogin }) {
  return (
    <>
      <Field label="Nome completo" placeholder="Seu nome" />
      <Field
        label="E-mail"
        type="email"
        placeholder="seuemail@empresa.com.br"
      />
      <Field label="Senha" type="password" placeholder="••••••••" />
      <Field
        label="Confirmar senha"
        type="password"
        placeholder="••••••••"
      />

      <Button className="mt-2 w-full" type="button">
        Criar conta
      </Button>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Já tem uma conta?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Entrar
        </button>
        .
      </p>

      <HelperText />
    </>
  );
}

function PasswordField() {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Senha</span>
        <button
          type="button"
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Esqueceu a senha?
        </button>
      </div>
      <input
        type="password"
        placeholder="••••••••"
        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
    </div>
  );
}

function HelperText() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      Ao entrar, você concorda com nossos{" "}
      <button
        type="button"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        Termos de Serviço
      </button>{" "}
      e{" "}
      <button
        type="button"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        Política de Privacidade
      </button>
      .
    </p>
  );
}

export default Auth;

