export function StatBar({
  label,
  homeValue,
  awayValue,
  homeLabel,
  awayLabel,
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  homeLabel: string;
  awayLabel: string;
}) {
  const total = homeValue + awayValue || 1;
  const homePct = Math.round((homeValue / total) * 100);

  return (
    <div>
      <p className="text-center font-display text-sm font-black italic uppercase text-white">
        {label}
      </p>
      <div className="mt-1 flex h-3 w-full overflow-hidden rounded-full bg-white/20">
        <div className="bg-brand-yellow" style={{ width: `${homePct}%` }} />
        <div className="bg-brand-red" style={{ width: `${100 - homePct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs font-bold text-white">
        <span>{homeLabel}</span>
        <span>{awayLabel}</span>
      </div>
    </div>
  );
}
