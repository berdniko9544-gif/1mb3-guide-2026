"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Привет! Я менеджер-консультант по гайду 1MB3. Помогу по продукту: что входит, кому подходит, цена, доступ и условия.",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [open, messages.length]);

  const quick = useMemo(
    () => ["Что входит?", "Сколько стоит?", "Как получить доступ?", "Это курс или гайд?"],
    []
  );

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setLoading(true);

    const nextMessages: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: nextMessages.slice(-6) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer ?? "Не смог ответить. Попробуй переформулировать." }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Похоже, сеть недоступна. Попробуй ещё раз чуть позже." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            className="mb-3 w-[min(92vw,420px)] overflow-hidden rounded-3xl section-glass shadow-[0_18px_55px_rgba(0,0,0,.35)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(0,255,166,.55)]" />
                <div className="text-sm font-extrabold tracking-wide">ИИ-консультант</div>
                <div className="text-xs text-white/60">бесплатно</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/80 hover:bg-white/10"
              >
                Закрыть
              </button>
            </div>

            <div ref={listRef} className="max-h-[420px] overflow-auto px-4 py-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "mb-2 flex justify-end" : "mb-2 flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl bg-gradient-to-r from-[color:var(--a1)] to-[color:var(--a2)] px-3 py-2 text-sm font-semibold"
                        : "max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mb-2 flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                    Думаю…
                  </div>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/80 hover:bg-white/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Например: «что я получу после оплаты?»"
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-white/20"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  Отправить
                </Button>
              </form>
              <div className="mt-2 text-[11px] text-white/50">
                Не обещает доход. Отвечает только по проекту.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 font-extrabold text-white shadow-[0_0_30px_rgba(120,140,255,.20)] backdrop-blur-xl hover:bg-white/10"
        aria-label="Открыть чат"
      >
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-[color:var(--a1)] to-[color:var(--a2)] shadow-[0_0_24px_rgba(120,140,255,.45)]">
          💬
        </span>
        <span className="text-sm">{open ? "Свернуть" : "Задать вопрос"}</span>
      </button>
    </div>
  );
}
