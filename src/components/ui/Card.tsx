import { clsx } from "@/lib/clsx";

type Team = "user" | "opponent" | "neutral" | "default";

const teamClasses: Record<Team, string> = {
  user: "bg-brand-blue-bright text-white",
  opponent: "bg-brand-red text-white",
  neutral: "bg-white text-black",
  default: "bg-brand-blue-bright/50 text-white",
};

export function Card({
  team = "neutral",
  className,
  children,
}: {
  team?: Team;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx("rounded-lg px-5 py-4 shadow-md", teamClasses[team], className)}>
      {children}
    </div>
  );
}
