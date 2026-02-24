'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const purchases = [
  { name: 'Александр К.', city: 'Москва', time: '2 минуты назад', avatar: '#ff425d' },
  { name: 'Марина Д.', city: 'Казахстан', time: '5 минут назад', avatar: '#2ed8ff' },
  { name: 'Дмитрий Р.', city: 'СПб', time: '8 минут назад', avatar: '#6da8ff' },
  { name: 'Елена С.', city: 'Минск', time: '12 минут назад', avatar: '#ff6b9d' },
  { name: 'Игорь В.', city: 'Киев', time: '15 минут назад', avatar: '#4ecdc4' },
];

export function RecentPurchasePopup() {
  const [current, setCurrent] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true);
      setCurrent(c => (c + 1) % purchases.length);
      setTimeout(() => setShow(false), 6000);
    }, 18000); // Show every 18 seconds

    return () => clearInterval(interval);
  }, []);

  const purchase = purchases[current];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 z-[60] hidden md:block"
        >
          <div className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 p-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                style={{
                  background: `linear-gradient(135deg, ${purchase.avatar}dd, ${purchase.avatar}88)`,
                }}
              >
                {purchase.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm font-extrabold text-white">
                    {purchase.name}
                  </div>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-400/20 text-xs">
                    ✓
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-white/60">
                  {purchase.city} · {purchase.time}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 bg-gradient-to-r from-[#2ed8ff]/10 to-[#ff425d]/10 px-4 py-2">
              <div className="text-xs font-bold text-white/80">
                Купил гайд «Заработок на ИИ 2026»
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
