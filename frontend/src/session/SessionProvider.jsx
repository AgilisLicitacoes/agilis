import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null); // {approved, role, fullName, email, uid}
  const [error, setError] = useState(null);

  async function refreshProfile(nextUser) {
    if (!nextUser) {
      setToken(null);
      setProfile(null);
      return;
    }

    const idToken = await nextUser.getIdToken();
    setToken(idToken);
    const me = await apiFetch("/api/me", { token: idToken, method: "GET" });
    setProfile(me);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (u) => {
      setLoading(true);
      setError(null);
      try {
        setFirebaseUser(u);
        await refreshProfile(u);
      } catch (e) {
        setError(e);
        // se o backend deu erro, ainda mantém user/token nulos pra não entrar no app quebrado
        setToken(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      loading,
      error,
      firebaseUser,
      token,
      profile,
      isLoggedIn: Boolean(firebaseUser),
      isApproved: Boolean(profile?.approved),
      isAdmin: profile?.role === "admin",
      async reload() {
        setLoading(true);
        setError(null);
        try {
          await refreshProfile(firebaseAuth.currentUser);
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      },
      async logout() {
        await signOut(firebaseAuth);
      }
    }),
    [loading, error, firebaseUser, token, profile],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

