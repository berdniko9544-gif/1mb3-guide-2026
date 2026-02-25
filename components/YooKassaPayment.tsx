'use client';

import { Button } from './Button';

export function YooKassaPayment() {
  return (
    <form
      action="https://yookassa.ru/integration/simplepay/payment"
      method="post"
      acceptCharset="utf-8"
      className="w-full"
    >
      {/* Hidden inputs for YooKassa configuration */}
      <input
        name="shopSuccessURL"
        type="hidden"
        value="https://disk.yandex.ru/i/wg1CGVedSqWvWQ"
      />
      <input
        name="shopFailURL"
        type="hidden"
        value="https://t.me/Inside1mb3"
      />
      <input name="customerNumber" type="hidden" value="Гайд по нейросетям" />
      <input name="sum" type="hidden" value="1990" />
      <input name="shopId" type="hidden" value="1250536" />

      {/* Custom styled button */}
      <Button
        type="submit"
        size="lg"
        className="w-full text-xl py-4 shadow-[0_12px_48px_rgba(120,140,255,.4)]"
      >
        Купить гайд — ₽ 1990
      </Button>

      {/* YooKassa logo - small and subtle */}
      <div className="flex items-center justify-center gap-2 mt-3 opacity-40">
        <span className="text-xs text-white/60">Оплата через</span>
        <img
          src="https://yookassa.ru/integration/simplepay/img/iokassa-gray.svg?v=1.33.0"
          width="80"
          height="19"
          alt="ЮKassa"
          className="opacity-60"
        />
      </div>
    </form>
  );
}
