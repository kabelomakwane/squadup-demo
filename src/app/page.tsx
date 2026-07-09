"use client";

import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/PillButton";

export default function AgeCheckPage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-brand-blue px-6 py-16 text-center">
      <div className="max-w-4xl">
        <h1 className="font-display text-headline-sm font-black italic uppercase text-brand-yellow sm:text-headline">
          Confirm you are
          <br />
          18 or over
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-bold text-white">
          Squad Up is an online game by SuperSport Bet. In order to play, we need to confirm
          whether you are over the age of 18. By continuing, you confirm you meet the minimum age
          requirement to use this platform.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <div className="w-full sm:w-48">
            <PillButton onClick={() => router.push("/landing")}>Yes</PillButton>
          </div>
          <div className="w-full sm:w-48">
            <PillButton onClick={() => router.push("/not-eligible")}>No</PillButton>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red font-display text-xs font-black italic text-white">
            S
          </span>
          <span className="text-sm font-bold uppercase tracking-wide text-white">
            Bet Responsibly
          </span>
        </div>
        <p className="max-w-3xl text-xs text-white/70">
          SuperSportBet is licenced by the Western Cape Gambling and Racing Board. Bookmaker
          licence: 10191097. No persons under the age of 18 are permitted to gamble. Winners know
          when to stop. National Responsible Gambling Programme toll free counselling line 0800
          006 008 or WHATSAPP HELP 076 675 0710. T&C&apos;s Apply.
        </p>
      </div>
    </main>
  );
}
