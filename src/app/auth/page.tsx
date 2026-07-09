"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/PillButton";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 23 23" className="h-5 w-5">
      <path fill="#F35325" d="M1 1h10v10H1z" />
      <path fill="#81BC06" d="M12 1h10v10H12z" />
      <path fill="#05A6F0" d="M1 12h10v10H1z" />
      <path fill="#FFBA08" d="M12 12h10v10H12z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 384 512" className="h-5 w-5" fill="black">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.3 0 272.9c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-57.7-90-57.7-91.3zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { enableDemoMode } = useAuth();
  const [manualOpen, setManualOpen] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Sign-in isn't configured yet — add your Supabase project keys to .env.local.");
      return;
    }

    setSubmitting(true);

    const supabase = createClient();
    const { error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/match/loading");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-brand-blue px-6 py-16 text-center">
      <div className="max-w-2xl">
        <h1 className="font-display text-headline-sm font-black italic uppercase leading-none sm:text-headline">
          <span className="text-brand-yellow">Wait!</span>{" "}
          <span className="text-white">Just Before</span>
          <br />
          <span className="text-white">We</span>{" "}
          <span className="text-brand-yellow">Kick Off&hellip;</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm font-bold text-white">
          We notice that you aren&apos;t signed in yet. Signing up allows for you to keep a record
          of your matches, and you&apos;ll get notifications from SuperSport Bet straight to your
          email.
        </p>

        {!manualOpen ? (
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-4">
            <div className="relative">
              <PillButton variant="secondary" icon={<GoogleIcon />} disabled>
                Continue with Google
              </PillButton>
              <span className="absolute -top-2 right-4 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                Coming soon
              </span>
            </div>
            <div className="relative">
              <PillButton variant="secondary" icon={<MicrosoftIcon />} disabled>
                Continue with Microsoft
              </PillButton>
              <span className="absolute -top-2 right-4 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                Coming soon
              </span>
            </div>
            <div className="relative">
              <PillButton variant="secondary" icon={<AppleIcon />} disabled>
                Continue with Apple
              </PillButton>
              <span className="absolute -top-2 right-4 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                Coming soon
              </span>
            </div>
            <button
              type="button"
              onClick={() => setManualOpen(true)}
              className="mt-2 text-sm font-bold uppercase tracking-wide text-white underline underline-offset-4"
            >
              Or sign-in manually
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-4 text-left">
            <div className="flex justify-center gap-4 text-sm font-bold uppercase text-white">
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className={mode === "sign-in" ? "text-brand-yellow" : "text-white/50"}
              >
                Sign In
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => setMode("sign-up")}
                className={mode === "sign-up" ? "text-brand-yellow" : "text-white/50"}
              >
                Sign Up
              </button>
            </div>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full bg-white px-5 py-3 text-black placeholder:text-gray-mid focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full bg-white px-5 py-3 text-black placeholder:text-gray-mid focus:outline-none"
            />
            {error && <p className="text-center text-sm font-bold text-brand-yellow">{error}</p>}
            <PillButton type="submit" disabled={submitting}>
              {submitting ? "Please wait..." : mode === "sign-in" ? "Sign In" : "Sign Up"}
            </PillButton>
          </form>
        )}

        {!isSupabaseConfigured && (
          <div className="mx-auto mt-8 max-w-md border-t border-white/20 pt-6">
            <p className="text-xs text-white/60">
              No Supabase project connected yet, so real sign-in isn&apos;t available in this
              deployment.
            </p>
            <div className="mt-3">
              <PillButton
                variant="outline"
                onClick={() => {
                  enableDemoMode();
                  router.push("/match/loading");
                }}
              >
                Skip Sign-In (Demo)
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
