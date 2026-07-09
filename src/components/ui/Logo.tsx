import { clsx } from "@/lib/clsx";

export function Logo({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const wordmarkSize = size === "lg" ? "text-headline-sm" : size === "md" ? "text-title" : "text-sm";

  return (
    <div className={clsx("flex flex-col items-center gap-1", className)}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red font-display text-sm font-black italic text-white">
          S
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-wide text-white">
          SuperSportBET
        </span>
      </div>
      <span className={clsx("font-display font-black italic uppercase text-brand-yellow", wordmarkSize)}>
        Squad Up
      </span>
    </div>
  );
}
