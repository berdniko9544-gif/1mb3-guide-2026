import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function Offer() {
  return (
    <main className="py-14">
      <Container>
        <div className="flex items-center justify-between gap-3">
          <Button href="/" variant="ghost" size="sm">← На главную</Button>
          <Button href="/#buy" size="sm">Купить доступ</Button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-black tracking-tight">Публичная оферта (шаблон)</h1>
          <p className="mt-3 text-white/70">
            ВАЖНО: это шаблон. Замените реквизиты и условия под вашу модель (ИП/ООО, цифровой продукт, доступ).
          </p>

          <h2 className="mt-6 text-xl font-black">1. Термины</h2>
          <p className="mt-2 text-white/75">«Продавец» — (укажите юрлицо/ИП). «Покупатель» — физ/юр лицо. «Продукт» — доступ к цифровым материалам/системе 1MB3.</p>

          <h2 className="mt-6 text-xl font-black">2. Предмет</h2>
          <p className="mt-2 text-white/75">Продавец предоставляет доступ к цифровому продукту после оплаты.</p>

          <h2 className="mt-6 text-xl font-black">3. Цена и оплата</h2>
          <p className="mt-2 text-white/75">Цена указана на сайте. Оплата осуществляется через платёжного провайдера.</p>

          <h2 className="mt-6 text-xl font-black">4. Порядок предоставления доступа</h2>
          <p className="mt-2 text-white/75">Доступ предоставляется автоматически/вручную (укажите) в течение (укажите) после подтверждения оплаты.</p>

          <h2 className="mt-6 text-xl font-black">5. Возврат</h2>
          <p className="mt-2 text-white/75">Укажите честные условия возврата. Для цифровых продуктов возврат может быть ограничен, если доступ предоставлен.</p>

          <h2 className="mt-6 text-xl font-black">6. Контакты и реквизиты</h2>
          <p className="mt-2 text-white/75">Контакты поддержки: support@yourdomain.ru, Telegram: @your_support</p>
          <p className="mt-2 text-white/75">Реквизиты: (укажите)</p>
        </div>
      </Container>
    </main>
  );
}
