import type { ButtonHTMLAttributes } from "react";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "secondary" | "outline";

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-red text-white hover:bg-brand-red/90",
  secondary: "bg-white text-black hover:bg-white/90",
  outline: "bg-transparent text-white border-2 border-white hover:bg-white/10",
};

export function PillButton({
  variant = "primary",
  icon,
  className,
  disabled,
  children,
  ...props
}: PillButtonProps) {
  return (
    <button
      className={clsx(
        "text-button inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-bold uppercase tracking-wide transition-colors",
        variantClasses[variant],
        disabled && "cursor-not-allowed bg-gray-light text-gray-mid hover:bg-gray-light",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <span>{children}</span>
      {icon ? <span className="shrink-0">{icon}</span> : null}
    </button>
  );
}
