'use client';

import { useEffect } from 'react';

export function YooKassaPayment() {
  useEffect(() => {
    // Load YooKassa script
    const script = document.createElement('script');
    script.src = 'https://yookassa.ru/integration/simplepay/js/yookassa_construct_form.js?v=1.33.0';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://yookassa.ru/integration/simplepay/css/yookassa_construct_form.css?v=1.33.0"
      />
      <form
        className="yoomoney-payment-form"
        action="https://yookassa.ru/integration/simplepay/payment"
        method="post"
        acceptCharset="utf-8"
      >
        <div className="ym-hidden-inputs">
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
        </div>

        <input name="customerNumber" type="hidden" value="Гайд по нейросетям" />

        <div className="ym-payment-btn-block">
          <div className="ym-input-icon-rub ym-display-none">
            <input
              name="sum"
              placeholder="0.00"
              className="ym-input ym-sum-input ym-required-input"
              type="number"
              step="any"
              value="1990"
            />
          </div>
          <button
            data-text="Купить"
            className="ym-btn-pay ym-result-price"
            type="submit"
          >
            <span className="ym-text-crop">Купить</span>{' '}
            <span className="ym-price-output"> 1&nbsp;990,00&nbsp;₽</span>
          </button>
          <img
            src="https://yookassa.ru/integration/simplepay/img/iokassa-gray.svg?v=1.33.0"
            className="ym-logo"
            width="114"
            height="27"
            alt="ЮKassa"
          />
        </div>
        <input name="shopId" type="hidden" value="1250536" />
      </form>
    </>
  );
}
