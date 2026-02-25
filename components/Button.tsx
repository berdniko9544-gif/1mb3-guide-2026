"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "solid" | "ghost";
  size?: "md" | "sm" | "lg";
  loading?: boolean;
  magnetic?: boolean;
};

export function Button({href, variant="solid", size="md", loading, magnetic=true, className, children, ...props}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const base = "inline-flex items-center justify-center rounded-full font-extrabold transition-all will-change-transform active:scale-[0.98]";
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[40px]",
    md: "px-5 py-3 text-base min-h-[44px]",
    lg: "px-6 py-3.5 text-lg min-h-[52px]",
  } as const;
  const variants = {
    solid: "magnetic-btn btn-shimmer text-white shadow-[0_2px_4px_rgba(0,0,0,.1),0_8px_16px_rgba(0,0,0,.15),0_0_0_1px_rgba(255,255,255,.1)_inset] bg-gradient-to-r from-[color:var(--a1)] to-[color:var(--a2)] hover:shadow-[0_4px_8px_rgba(0,0,0,.15),0_12px_24px_rgba(0,0,0,.2),0_0_0_1px_rgba(255,255,255,.15)_inset] hover:scale-[1.02] duration-300",
    ghost: "text-white/90 border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.01] duration-200",
  } as const;

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!magnetic || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const content = loading ? (
    <span className="flex items-center gap-2">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      Загрузка...
    </span>
  ) : children;

  if (href) {
    return (
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ display: "inline-block" }}
      >
        <Link 
          ref={ref as any}
          href={href} 
          className={cn(base, sizes[size], variants[variant], className)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ display: "inline-block" }}
    >
      <button 
        ref={ref as any}
        className={cn(base, sizes[size], variants[variant], className)} 
        disabled={loading || props.disabled}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {content}
      </button>
    </motion.div>
  );
}
