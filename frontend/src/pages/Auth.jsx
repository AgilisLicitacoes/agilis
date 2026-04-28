import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import agilisLogo from "@/assets/agilisnewlogo.png";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [resetOpen, setResetOpen] = useState(false);

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <img
              src={agilisLogo}
              alt="Agilis Licitações"
              className="h-6 w-6 object-contain"
            />
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
            <LoginForm onForgot={() => setResetOpen(true)} />
          ) : (
            <SignupForm switchToLogin={() => setMode("login")} />
          )}
        </main>
      </div>

      {resetOpen ? <ResetPasswordModal onClose={() => setResetOpen(false)} /> : null}
    </div>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, autoComplete }) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
    </div>
  );
}

function LoginForm({ onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = useMemo(() => email.trim() && password, [email, password]);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      // SessionProvider vai pegar o estado e chamar /api/me automaticamente
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Field
        label="E-mail"
        type="email"
        placeholder="seuemail@empresa.com.br"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} onForgot={onForgot} />

      {error ? <div className="mb-3 text-xs font-medium text-destructive">{String(error.message ?? error)}</div> : null}

      <Button className="mt-2 w-full" type="button" disabled={!canSubmit || loading} onClick={() => void onSubmit()}>
        {loading ? "Entrando..." : "Entrar na plataforma"}
      </Button>

      <HelperText />
    </>
  );
}

function SignupForm({ switchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const passwordMatch = password && confirm && password === confirm;
  const canSubmit = useMemo(
    () => fullName.trim().length >= 2 && email.trim() && password.length >= 6 && passwordMatch,
    [fullName, email, password, passwordMatch],
  );

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const idToken = await cred.user.getIdToken();
      await apiFetch("/api/me/profile", {
        token: idToken,
        method: "POST",
        body: JSON.stringify({ fullName: fullName.trim() })
      });
      // SessionProvider já vai buscar /api/me; mas isso garante que o profile existe
      switchToLogin?.();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Field
        label="Nome completo"
        placeholder="Seu nome"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
      />
      <Field
        label="E-mail"
        type="email"
        placeholder="seuemail@empresa.com.br"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Field
        label="Senha"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <Field
        label="Confirmar senha"
        type="password"
        placeholder="••••••••"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
      />

      {confirm && !passwordMatch ? (
        <div className="mb-3 text-xs font-medium text-destructive">As senhas não conferem.</div>
      ) : null}
      {error ? <div className="mb-3 text-xs font-medium text-destructive">{String(error.message ?? error)}</div> : null}

      <Button className="mt-2 w-full" type="button" disabled={!canSubmit || loading} onClick={() => void onSubmit()}>
        {loading ? "Criando..." : "Criar conta"}
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
          onClick={onForgot}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Esqueceu a senha?
        </button>
      </div>
      <input
        type="password"
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        autoComplete="current-password"
        className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
    </div>
  );
}

function ResetPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  async function onSend() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim());
      setStatus("ok");
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-2 text-lg font-bold">Redefinir senha</div>
        <div className="mb-4 text-sm text-muted-foreground">
          Enviaremos um e-mail com link de redefinição (Identity Platform).
        </div>

        <Field
          label="E-mail"
          type="email"
          placeholder="seuemail@empresa.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        {status === "ok" ? (
          <div className="mb-3 text-xs font-medium text-foreground">E-mail enviado. Verifique sua caixa de entrada.</div>
        ) : null}
        {error ? <div className="mb-3 text-xs font-medium text-destructive">{String(error.message ?? error)}</div> : null}

        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" className="h-11 flex-1" onClick={onClose}>
            Fechar
          </Button>
          <Button
            type="button"
            className="h-11 flex-1"
            disabled={!email.trim() || loading}
            onClick={() => void onSend()}
          >
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
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

