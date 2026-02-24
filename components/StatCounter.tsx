"use client";
import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Props = {
  value: string;
  label: string;
  delay?: number;
};

export function StatCounter({ value, label, delay = 0 }: Props) {
  const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        observer.disconnect();

        const duration = 1100;
        let startTime: number | null = null;

        function step(ts: number) {
          if (!startTime) startTime = ts + delay * 1000;
          if (ts < startTime) { requestAnimationFrame(step); return; }
          const progress = Math.min((ts - startTime) / duration, 1);
          setCount(Math.round(easeOutCubic(progress) * numeric));
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric, delay]);

  return (
    <div ref={ref} className="neon-card rounded-2xl px-4 py-3">
      <div className="text-2xl font-black text-white tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.12em] text-white/65">{label}</div>
    </div>
  );
}
