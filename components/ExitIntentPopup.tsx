'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem('exit_popup_shown');
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !show) {
        setShow(true);
        localStorage.setItem('exit_popup_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="relative w-[min(94vw,480px)] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#060b18] to-[#050913] shadow-[0_24px_80px_rgba(0,0,0,.7)]">
        {/* Glow effect */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,66,93,0.15),transparent_50%)]" />
        
        <div className="relative p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff425d]/20 to-[#2ed8ff]/20 text-4xl">
              🎁
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-white md:text-3xl">
              Подождите!
            </h3>
            <p className="mt-3 text-base leading-relaxed text-white/75 md:text-lg">
              Получите <span className="font-bold text-[#ff425d]">дополнительную скидку 10%</span> при покупке в течение следующих 15 минут
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#2ed8ff]/20 bg-[#2ed8ff]/5 p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">Специальное предложение</div>
                <div className="text-xs text-white/60">Только для тех, кто уходит</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button 
              onClick={() => {
                // Apply discount logic here
                window.location.href = '#offer';
                setShow(false);
              }}
              className="w-full"
            >
              Получить скидку 10%
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShow(false)}
              className="w-full"
            >
              Нет, спасибо
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            Предложение действует 15 минут
          </p>
        </div>
      </div>
    </div>
  );
}
