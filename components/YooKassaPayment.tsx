'use client';

import { Button } from './Button';

export function YooKassaPayment() {
  const handlePayment = () => {
    // Создаём форму программно и отправляем
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://yookassa.ru/integration/simplepay/payment';
    form.acceptCharset = 'utf-8';
    
    const fields = {
      shopSuccessURL: 'https://disk.yandex.ru/i/wg1CGVedSqWvWQ',
      shopFailURL: 'https://t.me/Inside1mb3',
      customerNumber: 'Гайд по нейросетям',
      sum: '1990',
      shopId: '1250536'
    };
    
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="w-full">
      {/* Custom styled button */}
      <Button
        onClick={handlePayment}
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
