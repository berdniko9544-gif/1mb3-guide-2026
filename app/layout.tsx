import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { MeshGradient } from "@/components/MeshGradient";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#050913",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.brand} — ${siteConfig.productName}`,
    template: `%s | ${siteConfig.brand}`,
  },
  description:
    "Цифровой гайд 2026 по заработку на ИИ: 12 направлений монетизации, инструменты, план на 30 дней, юридические нюансы и шаблоны для старта. Для РФ/СНГ.",
  keywords: [
    "заработок на ИИ",
    "искусственный интеллект",
    "монетизация AI",
    "нейросети",
    "фриланс",
    "цифровые продукты",
    "AI бизнес",
    "ChatGPT",
    "Midjourney",
    "гайд 2026",
  ],
  authors: [{ name: "Яна", url: siteUrl }],
  creator: "Яна",
  publisher: siteConfig.brand,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: siteConfig.brand,
    title: `${siteConfig.brand} — ${siteConfig.productName}`,
    description:
      "Практичный гайд по заработку на ИИ: 12 направлений, инструменты, план действий на 30 дней. Для РФ/СНГ рынка.",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.productName} — превью`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} — ${siteConfig.productName}`,
    description:
      "Цифровой гайд 2026 по заработку на ИИ: 12 направлений, инструменты, план на 30 дней.",
    images: ["/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <MeshGradient />
        {children}
      </body>
    </html>
  );
}
