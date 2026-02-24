import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Web3Background } from "@/components/Web3Background";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${siteConfig.brand} — ${siteConfig.productName}`,
  description:
    "Цифровой гайд 2026 по заработку на ИИ: 12 направлений, инструменты, план на 30 дней, юридические нюансы и шаблоны для старта.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: `${siteConfig.brand} — ${siteConfig.productName}`,
    description:
      "Понятный состав цифрового гайда: что внутри, кому подходит, как получить доступ после оплаты.",
    images: ["/hero.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106539045', 'ym');
              ym(106539045, 'init', {ssr:true, webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106539045"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body className={`${inter.className} min-h-dvh antialiased`}>
        <Web3Background />{children}
      </body>
    </html>
  );
}
