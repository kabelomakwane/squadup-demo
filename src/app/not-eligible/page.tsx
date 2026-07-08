export default function NotEligiblePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-brand-blue px-6 py-16 text-center">
      <div className="max-w-3xl">
        <h1 className="font-display text-headline-sm font-black italic uppercase text-brand-yellow sm:text-headline">
          You must be
          <br />
          18 or over
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-bold text-white">
          Sorry, Squad Up is only available to players aged 18 and over. Come back once
          you&apos;ve turned 18 to build your squad and play.
        </p>
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
          licence: 10191097. No persons under the age of 18 are permitted to gamble.
        </p>
      </div>
    </main>
  );
}
