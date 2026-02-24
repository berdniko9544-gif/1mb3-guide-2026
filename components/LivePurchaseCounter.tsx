'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LivePurchaseCounter() {
  const [count, setCount] = useState(1247);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setCount(c => c + 1);
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 2000);
      }
    }, 25000); // Every 25 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 left-4 z-[60] hidden md:block"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400"></span>
            </span>
          </div>
          <div className="text-sm">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="font-bold text-white"
              >
                {count}
              </motion.span>
            </AnimatePresence>
            <span className="ml-1 text-white/70">покупателей</span>
          </div>
        </div>
        
        <AnimatePresence>
          {showPulse && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute -right-1 -top-1"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-400 text-xs font-black text-white">
                +1
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
