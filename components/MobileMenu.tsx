'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '#inside', label: 'Что входит' },
    { href: '#proof', label: 'Отзывы' },
    { href: '#author', label: 'Автор' },
    { href: '#offer', label: 'Цена' },
    { href: '#faq', label: 'FAQ' },
  ];

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[71] w-64 border-l border-white/10 bg-gradient-to-b from-[#060b18] to-[#050913] shadow-[0_0_80px_rgba(0,0,0,.8)] md:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                  <span className="text-sm font-black tracking-[0.1em] text-white/85">
                    МЕНЮ
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  {menuItems.map((item, i) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={handleClick}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-transparent px-4 py-3 text-base font-extrabold text-white/80 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-auto border-t border-white/10 p-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                      Поддержка
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Telegram: @1mb3_support
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
