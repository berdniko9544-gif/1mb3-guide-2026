'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  // Set end time to 24 hours from now (or use a fixed date)
  const now = new Date().getTime();
  const endTime = now + (24 * 60 * 60 * 1000); // 24 hours
  
  const difference = endTime - now;
  
  if (difference > 0) {
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  
  return { hours: 0, minutes: 0, seconds: 0 };
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {[0, 0, 0].map((_, i) => (
          <div key={i} className="countdown-box flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="text-2xl font-black text-white md:text-3xl">00</span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
              {i === 0 ? 'часов' : i === 1 ? 'минут' : 'секунд'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="countdown-box flex flex-col items-center justify-center rounded-xl border border-[#ff425d]/30 bg-gradient-to-b from-[#ff425d]/10 to-[#ff425d]/5 px-4 py-3 shadow-[0_0_20px_rgba(255,66,93,0.15)]">
        <span className="text-2xl font-black text-white md:text-3xl">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
          часов
        </span>
      </div>
      <div className="countdown-box flex flex-col items-center justify-center rounded-xl border border-[#2ed8ff]/30 bg-gradient-to-b from-[#2ed8ff]/10 to-[#2ed8ff]/5 px-4 py-3 shadow-[0_0_20px_rgba(46,216,255,0.15)]">
        <span className="text-2xl font-black text-white md:text-3xl">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
          минут
        </span>
      </div>
      <div className="countdown-box flex flex-col items-center justify-center rounded-xl border border-[#6da8ff]/30 bg-gradient-to-b from-[#6da8ff]/10 to-[#6da8ff]/5 px-4 py-3 shadow-[0_0_20px_rgba(109,168,255,0.15)]">
        <span className="text-2xl font-black text-white md:text-3xl">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-wider text-white/50">
          секунд
        </span>
      </div>
    </div>
  );
}
