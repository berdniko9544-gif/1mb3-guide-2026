'use client';

import { Button } from './Button';

export function YooKassaPayment() {
  // Прямая ссылка на оплату YooKassa (без SimplePay формы)
  const paymentUrl = `https://yookassa.ru/integration/simplepay/payment?shopId=1250536&sum=1990&customerNumber=Гайд%20по%20нейросетям&shopSuccessURL=${encodeURIComponent('https://disk.yandex.ru/i/wg1CGVedSqWvWQ')}&shopFailURL=${encodeURIComponent('https://t.me/Inside1mb3')}`;

  return (
    <div className="w-full">
      {/* Custom styled button as link */}
      <Button
        href={paymentUrl}
        size="lg"
        className="w-full text-xl py-5 md:py-4 min-h-[64px] md:min-h-[56px] shadow-[0_12px_48px_rgba(120,140,255,.4)] hover:shadow-[0_16px_64px_rgba(120,140,255,.5)]"
        magnetic={false}
      >
        <span className="flex items-center justify-center gap-2">
          <span>Купить гайд</span>
          <span className="text-2xl">→</span>
          <span className="font-black">₽ 1990</span>
        </span>
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
    </div>
  );
}
