export function ScoreBug({
  homeName,
  awayName,
  homeScore,
  awayScore,
  clock,
}: {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  clock: string;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center gap-2 rounded-full bg-black/20 px-2 py-2">
        <span className="rounded-full border-2 border-brand-yellow px-4 py-1 text-badge font-bold uppercase text-white">
          {homeName}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-lg font-black text-black">
          {homeScore}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red font-display text-xs font-black italic text-white">
          S
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-lg font-black text-black">
          {awayScore}
        </span>
        <span className="rounded-full border-2 border-brand-red px-4 py-1 text-badge font-bold uppercase text-white">
          {awayName}
        </span>
      </div>
      <span className="absolute -bottom-3 rounded-full bg-white px-3 py-0.5 text-xs font-bold text-black shadow">
        {clock}
      </span>
    </div>
  );
}
