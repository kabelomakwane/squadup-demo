"use client";

import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/PillButton";
import { GhostMarquee } from "@/components/ui/GhostMarquee";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-bright px-6 py-16 text-center">
      <GhostMarquee className="absolute inset-x-0 top-0" />
      <GhostMarquee className="absolute inset-x-0 bottom-0" />

      <div className="relative z-10 flex flex-col items-center">
        <Logo size="lg" />
        <p className="mx-auto mt-6 max-w-xl text-base font-bold text-white">
          Build a five-a-side lineup, choose an opponent, and watch a simulated fixture unfold
          with live play-by-play drama.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <div className="w-full sm:w-56">
            <PillButton onClick={() => router.push("/team-picker?tutorial=1")}>
              How to Play
            </PillButton>
          </div>
          <div className="w-full sm:w-56">
            <PillButton onClick={() => router.push("/team-picker")}>New Game</PillButton>
          </div>
        </div>
      </div>
    </main>
  );
}
