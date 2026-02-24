import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function Privacy() {
  return (
    <main className="py-14">
      <Container>
        <div className="flex items-center justify-between gap-3">
          <Button href="/" variant="ghost" size="sm">← На главную</Button>
          <Button href="/#buy" size="sm">Купить доступ</Button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-black tracking-tight">Политика конфиденциальности (шаблон)</h1>
          <p className="mt-3 text-white/70">
            ВАЖНО: замените данные оператора и перечень собираемых данных под ваш сайт. Это шаблон.
          </p>

          <h2 className="mt-6 text-xl font-black">1. Какие данные собираем</h2>
          <p className="mt-2 text-white/75">Имя, email/телефон (если есть форма), технические данные (cookies, IP) — при необходимости.</p>

          <h2 className="mt-6 text-xl font-black">2. Зачем собираем</h2>
          <p className="mt-2 text-white/75">Для предоставления доступа, поддержки, улучшения сервиса, аналитики.</p>

          <h2 className="mt-6 text-xl font-black">3. Третьи лица</h2>
          <p className="mt-2 text-white/75">Платёжные провайдеры и сервисы аналитики (укажите конкретно).</p>

          <h2 className="mt-6 text-xl font-black">4. Как связаться</h2>
          <p className="mt-2 text-white/75">support@yourdomain.ru, Telegram: @your_support</p>
        </div>
      </Container>
    </main>
  );
}
