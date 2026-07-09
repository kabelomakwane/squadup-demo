"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const DEMO_MODE_KEY = "squad-up-demo-mode";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isSignedIn: boolean;
  demoMode: boolean;
  enableDemoMode: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  isSignedIn: false,
  demoMode: false,
  enableDemoMode: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [demoMode, setDemoMode] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(DEMO_MODE_KEY) === "1",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  function enableDemoMode() {
    sessionStorage.setItem(DEMO_MODE_KEY, "1");
    setDemoMode(true);
  }

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{ session, user, loading, isSignedIn: !!user || demoMode, demoMode, enableDemoMode }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
