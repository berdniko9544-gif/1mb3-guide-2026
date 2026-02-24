import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "solid" | "ghost";
  size?: "md" | "sm" | "lg";
  loading?: boolean;
};

export function Button({href, variant="solid", size="md", loading, className, ...props}: Props) {
  const base = "inline-flex items-center justify-center rounded-full font-extrabold transition will-change-transform active:scale-[0.99]";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-3.5 text-lg",
  } as const;
  const variants = {
    solid: "btn-shimmer text-white shadow-[0_8px_32px_rgba(120,140,255,.25),0_0_0_1px_rgba(255,255,255,.1)_inset] bg-gradient-to-r from-[color:var(--a1)] to-[color:var(--a2)] hover:brightness-110 hover:shadow-[0_12px_40px_rgba(120,140,255,.35),0_0_0_1px_rgba(255,255,255,.15)_inset] hover:scale-[1.02] transition-all duration-300",
    ghost: "text-white/90 border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200",
  } as const;

  if (href) {
    return (
      <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
        {props.children}
      </Link>
    );
  }

  return (
    <button 
      className={cn(base, sizes[size], variants[variant], className)} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Загрузка...
        </span>
      ) : props.children}
    </button>
  );
}
