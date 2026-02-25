"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { ChatWidget } from "@/components/ChatWidget";
import { FadeIn } from "@/components/FadeIn";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { StatCounter } from "@/components/StatCounter";
import { MobileMenu } from "@/components/MobileMenu";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { LivePurchaseCounter } from "@/components/LivePurchaseCounter";
import { RecentPurchasePopup } from "@/components/RecentPurchasePopup";
import { YooKassaPayment } from "@/components/YooKassaPayment";
import { siteConfig } from "@/lib/config";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type OfferVariant = "control" | "proof";

type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer_host: string;
};

const DEFAULT_ATTRIBUTION: Attribution = {
  utm_source: "direct",
  utm_medium: "none",
  utm_campaign: "none",
  utm_content: "none",
  utm_term: "none",
  referrer_host: "direct",
};

const VARIANT_STORAGE_KEY = "1mb3_offer_variant_v1";

const PAYMENT_SUCCESS_VALUES = ["success", "succeeded", "paid", "true", "1", "ok"];

function parseReferrerHost(referrer: string) {
  if (!referrer) return "direct";
  try {
    return new URL(referrer).hostname || "direct";
  } catch {
    return "direct";
  }
}

function readAttributionFromUrl(): Attribution {
  if (typeof window === "undefined") return DEFAULT_ATTRIBUTION;

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || "direct",
    utm_medium: params.get("utm_medium") || "none",
    utm_campaign: params.get("utm_campaign") || "none",
    utm_content: params.get("utm_content") || "none",
    utm_term: params.get("utm_term") || "none",
    referrer_host: parseReferrerHost(document.referrer),
  };
}

function getOrCreateVariant(): OfferVariant {
  if (typeof window === "undefined") return "control";

  const stored = window.localStorage.getItem(VARIANT_STORAGE_KEY);
  if (stored === "control" || stored === "proof") {
    return stored;
  }

  const assigned: OfferVariant = Math.random() < 0.5 ? "control" : "proof";
  window.localStorage.setItem(VARIANT_STORAGE_KEY, assigned);
  return assigned;
}

function hasPurchaseSuccessSignal() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const candidates = [
    params.get("payment_status"),
    params.get("status"),
    params.get("paid"),
    params.get("success"),
  ]
    .filter(Boolean)
    .map((item) => item!.toLowerCase());

  return candidates.some((value) => PAYMENT_SUCCESS_VALUES.includes(value));
}

const stats = [
  { value: "12", label: "направлений" },
  { value: "200+", label: "сервисов в бонусе" },
  { value: "30", label: "дней плана" },
];

const testimonials = [
  {
    name: "Александр К.",
    role: "Фрилансер · Москва",
    initials: "АК",
    color: "#ff425d",
    date: "2 фев 2026",
    message:
      "Взял гайд, выбрал одно направление — AI-фото для маркетплейсов. Через 3 недели закрыл первые 3 заказа. Всё структурировано, не пришлось тратить дни на поиск инфы с нуля. Шаблон договора — вообще отдельное спасибо 🔥",
    result: "+27 000 ₽ за 21 день",
  },
  {
    name: "Марина Д.",
    role: "SMM-специалист · Казахстан",
    initials: "МД",
    color: "#2ed8ff",
    date: "18 янв 2026",
    message:
      "Давно знала про нейросети, но не понимала как продавать. Гайд дал конкретику: какие ниши рабочие, что предложить клиенту, как упаковать оффер. Первого клиента нашла за 5 дней после прочтения. Реально работает.",
    result: "Первый клиент за 5 дней",
  },
  {
    name: "Дмитрий Р.",
    role: "Предприниматель · СПб",
    initials: "ДР",
    color: "#6da8ff",
    date: "25 янв 2026",
    message:
      "Купил для своей команды как карту внедрения. Раздали по блокам — кто-то взял контент, кто-то автоматизацию, кто-то боты. За месяц внедрили 4 направления из 12. Каталог сервисов оказался неожиданно полезным.",
    result: "4 направления за 1 месяц",
  },
];

const included = [
  "PDF-гайд 2026 по заработку на ИИ для РФ/СНГ.",
  "12 направлений монетизации с примерами, ценами и точками входа.",
  "План действий на 30 дней + чек-лист «первый заказ за 7 дней».",
  "Юридический блок: риски, deepfake, авторские права, базовая безопасность.",
  "Шаблон договора с клиентом и практические заготовки для старта.",
  "Бонус: каталог 200+ нейросетей и ИИ-сервисов.",
];

const modulePreview = [
  {
    icon: "⚡",
    title: "Ошибки и старт",
    text: "5 ошибок, которые убивают доход, и как быстрее выйти на первые продажи.",
  },
  {
    icon: "🗂️",
    title: "12 направлений",
    text: "Фото для соцсетей, боты для бизнеса, техуслуги, цифровые продукты и другие ниши.",
  },
  {
    icon: "🔧",
    title: "Инструменты",
    text: "Стек под задачи: текст, дизайн, видео, автоматизация, аналитика.",
  },
  {
    icon: "📅",
    title: "План 30 дней",
    text: "Пошаговый маршрут: фокус, портфолио, первые клиенты, кейсы, масштабирование.",
  },
  {
    icon: "🛡️",
    title: "Право и безопасность",
    text: "Что учитывать в РФ/СНГ, чтобы снизить риски в коммерческой работе.",
  },
  {
    icon: "🎁",
    title: "Бонусы",
    text: "Шаблон договора, чек-листы и расширенный каталог сервисов.",
  },
];

const fit = [
  "Новичкам, которые хотят выбрать 1 направление и стартовать без хаоса.",
  "Фрилансерам, которые хотят упаковать AI-услуги в понятный оффер.",
  "Предпринимателям, кому нужна практичная карта внедрения ИИ.",
];

const notFit = [
  "Тем, кто ждёт «пассив без действий».",
  "Тем, кому нужен большой курс с куратором 1:1.",
  "Тем, кто ищет гарантию конкретного дохода.",
];

const notIncluded = [
  "Личное наставничество и созвоны.",
  "Выполнение услуг «под ключ» за вас.",
  "Гарантия дохода или конкретных сумм.",
];

const trustChecks = [
  "На странице открыто указано, что входит и что не входит в покупку.",
  "Есть юридические страницы: оферта и политика конфиденциальности.",
  "Формат прозрачен: цифровой гайд, без скрытого «кураторства».",
];

const faq = [
  {
    q: "Что именно я покупаю?",
    a: "Цифровой гайд в формате PDF + шаблоны + чек-листы + каталог сервисов. Это не курс и не сопровождение.",
  },
  {
    q: "Как получить доступ после оплаты?",
    a: "Доступ выдаётся сразу после оплаты по указанному механизму (бот / email / кабинет).",
  },
  {
    q: "Кому особенно полезен гайд?",
    a: "Тем, кто хочет монетизировать ИИ через услуги или цифровые продукты по понятному плану.",
  },
  {
    q: "Есть гарантия дохода?",
    a: "Нет. Результат зависит от вашей ниши, действий, качества оффера и регулярности внедрения.",
  },
];

export default function Page() {
  const [variant, setVariant] = useState<OfferVariant>("control");
  const [attribution, setAttribution] = useState<Attribution>(DEFAULT_ATTRIBUTION);
  const [stepOpen, setStepOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const lastScrollYRef = useRef(0);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://1mb3-guide-2026.vercel.app";

  // JSON-LD structured data for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": siteConfig.productName,
    "description": "Цифровой гайд 2026 по заработку на ИИ: 12 направлений монетизации, инструменты, план на 30 дней для РФ/СНГ",
    "image": `${siteUrl}/hero.png`,
    "brand": {
      "@type": "Brand",
      "name": siteConfig.brand
    },
    "offers": {
      "@type": "Offer",
      "url": siteUrl,
      "priceCurrency": "RUB",
      "price": "1990",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": siteConfig.brand
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const heroCopy =
    variant === "proof"
      ? {
          kicker: "ПРАКТИЧНЫЙ ГАЙД • ФОКУС НА ВНЕДРЕНИЕ",
          description:
            "Вы покупаете только цифровой гайд: как выбрать AI-направление, упаковать оффер и запустить первые продажи без долгой теории.",
          ctaPrimary: "Забрать гайд и внедрить план",
          ctaSecondary: "Посмотреть состав",
        }
      : {
          kicker: "ЦИФРОВОЙ ПРОДУКТ • ПОКУПКА = ГАЙД",
          description:
            "Вы покупаете только цифровой гайд: направления, инструменты, связки, план внедрения и шаблоны. Без «воды», без кураторства, без обещаний дохода.",
          ctaPrimary: "Купить гайд",
          ctaSecondary: "Что внутри",
        };

  const offerButtonText =
    variant === "proof"
      ? "Оплатить и получить план действий"
      : "Оплатить и получить";

  useEffect(() => {
    const assignedVariant = getOrCreateVariant();
    const currentAttribution = readAttributionFromUrl();

    setVariant(assignedVariant);
    setAttribution(currentAttribution);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "view_content",
        product: siteConfig.productName,
        variant: assignedVariant,
        ...currentAttribution,
      });

      if (hasPurchaseSuccessSignal()) {
        window.dataLayer.push({
          event: "purchase",
          product: siteConfig.productName,
          variant: assignedVariant,
          source: "return_success_query",
          ...currentAttribution,
        });
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setProgress(value);

      // Auto-hide navigation
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollYRef.current = currentScrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function track(event: string, payload?: Record<string, string | number | boolean>) {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, variant, ...attribution, ...payload });
  }

  function openStep(source: string) {
    track("cta_click", { source });
    setStepOpen(true);
  }

  function closeStep(source: string) {
    track("modal_close", { source });
    setStepOpen(false);
  }

  function proceedToPayment() {
    track("begin_checkout", { source: "modal_confirm" });
    // Payment form is now shown in the modal
  }

  const supportUrl = siteConfig.supportTg.startsWith("@")
    ? `https://t.me/${siteConfig.supportTg.slice(1)}`
    : siteConfig.supportTg;

  return (
    <main className="relative pb-16" data-ab-variant={variant}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header 
        className={`sticky top-0 z-[66] border-b border-white/10 bg-[#050913]/70 backdrop-blur-xl transition-transform duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="text-sm font-black tracking-[0.1em] text-white/85">1MB3 GUIDE</div>
            <nav className="hidden gap-2 md:flex">
              <a className="nav-chip" href="#inside">Что входит</a>
              <a className="nav-chip" href="#proof">Отзывы</a>
              <a className="nav-chip" href="#author">Автор</a>
              <a className="nav-chip" href="#offer">Цена</a>
              <a className="nav-chip" href="#faq">FAQ</a>
            </nav>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => openStep("topbar") } className="hidden md:inline-flex">
                Купить
              </Button>
              <MobileMenu />
            </div>
          </div>
        </Container>
        <div className="h-[2px] w-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#ff425d] to-[#2ed8ff] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10 pb-32 pt-32 md:pb-40 md:pt-40 lg:pb-48 lg:pt-48">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_280px_at_12%_8%,rgba(255,66,93,.10),transparent_65%),radial-gradient(760px_340px_at_88%_12%,rgba(46,216,255,.12),transparent_65%)]" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <div>
              <FadeIn delay={0}>
                <p className="neon-kicker">{heroCopy.kicker}</p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h1 className="mt-8 text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.96] tracking-[-0.02em]" style={{textWrap: "balance"}}>
                  {siteConfig.productName}
                  <br />
                  <span className="metal-text">для РФ/СНГ</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.16}>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
                  {heroCopy.description}
                </p>
              </FadeIn>

              <FadeIn delay={0.22}>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {stats.map((item, i) => (
                    <StatCounter key={item.label} value={item.value} label={item.label} delay={i * 0.08} />
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#ff425d]/40 to-[#2ed8ff]/40 blur-[28px] animate-pulse" />
                    <Button size="lg" onClick={() => openStep("hero") } className="relative">
                      {heroCopy.ctaPrimary}
                    </Button>
                  </div>
                  <Button size="lg" variant="ghost" href="#inside">
                    {heroCopy.ctaSecondary}
                  </Button>
                </div>
                <p className="mt-6 text-sm text-white/55">
                  Формат: {siteConfig.guideFormat} · Обновлено: {siteConfig.guideUpdatedAt}
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.15} direction="left">
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-black/35 p-2 shadow-[0_28px_70px_rgba(0,0,0,.45)]">
              <div className="relative overflow-hidden rounded-[22px]">
                <Image
                  src="/hero.png"
                  alt="Стиль 1MB3"
                  width={1400}
                  height={1100}
                  priority
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff425d]/35 via-transparent to-[#2ed8ff]/40" />
                <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/20 bg-black/55 px-4 py-3 backdrop-blur-xl">
                  <div className="text-xs font-extrabold tracking-[0.12em] text-white/65">ВЫ ПОКУПАЕТЕ</div>
                  <p className="mt-1 text-sm text-white/90">{siteConfig.productType}</p>
                </div>
              </div>
            </div>
            </FadeIn>
          </div>
        </Container>
        <ScrollIndicator />
      </section>

      {/* ── Social proof ticker ── */}
      <div className="overflow-hidden border-y border-white/[0.06] bg-white/[0.015] py-3">
        <div className="ticker-track">
          {[0, 1].map((n) => (
            <span key={n} className="flex shrink-0 items-center gap-10 pr-10 text-[11px] font-bold uppercase tracking-widest text-white/40 whitespace-nowrap">
              <span>✈️&nbsp; AI×Business: 1MB3 &nbsp;·&nbsp; 2 900+ подписчиков</span>
              <span className="text-white/20">|</span>
              <span>⚡&nbsp; 1 200+ покупателей гайда</span>
              <span className="text-white/20">|</span>
              <span>🗺️&nbsp; 12 направлений монетизации</span>
              <span className="text-white/20">|</span>
              <span>🎁&nbsp; 200+ сервисов в каталоге</span>
              <span className="text-white/20">|</span>
              <span>🔒&nbsp; Оферта открыта до оплаты</span>
              <span className="text-white/20">|</span>
              <span>📅&nbsp; Обновлено февраль 2026</span>
              <span className="text-white/20">|</span>
            </span>
          ))}
        </div>
      </div>

      <Section
        id="inside"
        title="Что вы получаете после оплаты"
        subtitle="Прозрачный состав продукта, чтобы было ясно, за что вы платите."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {included.map((item, i) => (
            <RevealOnScroll key={item} delay={i * 0.08} direction="up">
              <article className="check-item neon-card rounded-2xl px-6 py-5 text-white/85">
                <span className="check-icon">✓</span>
                <span>{item}</span>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      <Section
        id="preview"
        variant="alt"
        title="Превью содержания"
        subtitle="Ключевые темы гайда для быстрого понимания содержания."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {modulePreview.map((item, i) => (
            <RevealOnScroll key={item.title} delay={i * 0.1} direction="up">
              <article className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02]">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">{item.icon}</span>
                <div>
                  <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.text}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      <Section
        id="proof"
        title="Что говорят покупатели"
        subtitle="Отзывы от людей, которые уже внедрили материалы из гайда."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <RevealOnScroll key={item.name} delay={i * 0.15} direction="up">
            <article className="neon-card flex flex-col rounded-3xl overflow-hidden transition-all duration-400 hover:scale-[1.03] h-full">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/[0.02] px-6 py-5">
                <div className="min-w-0 flex-1">
                  <div className="text-base font-extrabold text-white">{item.name}</div>
                  <div className="text-xs text-white/50 mt-1">{item.role}</div>
                </div>
                <div className="shrink-0 text-xs text-white/35">{item.date}</div>
              </div>

              {/* Message */}
              <div className="flex-1 px-6 py-6">
                <p className="text-sm leading-relaxed text-white/80">{item.message}</p>
              </div>

              {/* Result highlight */}
              <div className="border-t border-white/8 bg-gradient-to-r from-[#2ed8ff]/10 to-[#ff425d]/10 px-6 py-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-sm font-extrabold text-white">{item.result}</span>
                </div>
                <div className="mt-2 text-[11px] text-white/40">✓ Подтверждённый покупатель</div>
              </div>
            </article>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      <Section
        id="author"
        variant="alt"
        title="Кто создал гайд"
        subtitle="Авторы — практики, а не теоретики. Работают с AI-монетизацией и автоматизацией в Рунете с 2023 года."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Author 1: Яна */}
          <div className="neon-card rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(255,66,93,.25)]">
                <Image
                  src="/author-avatar yana.jpg"
                  alt={siteConfig.authorName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-xl font-black text-white">{siteConfig.authorName}</div>
                <div className="mt-0.5 text-sm text-white/55">{siteConfig.authorFocus}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={siteConfig.authorTg}
                    target="_blank"
                    rel="noreferrer"
                    className="trust-pill hover:border-[#2ed8ff]/50 hover:text-white transition-colors"
                  >
                    TG {siteConfig.authorHandle}
                  </a>
                  <a
                    href={siteConfig.instagramAuthor}
                    target="_blank"
                    rel="noreferrer"
                    className="trust-pill hover:border-[#ff425d]/50 hover:text-white transition-colors"
                  >
                    Instagram @yana__yanoshka
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/75">
              Запустила собственные проекты на AI-монетизации в Рунете. Собрала гайд как практический инструмент, а не учебник — с конкретными нишами, реальными связками и юридическими нюансами для РФ/СНГ.
            </p>
          </div>

          {/* Author 2: Николай */}
          <div className="neon-card rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2ed8ff]/80 to-[#6da8ff]/60 text-2xl font-black text-white shadow-[0_0_30px_rgba(46,216,255,.25)]">
                НБ
              </div>
              <div>
                <div className="text-xl font-black text-white">{siteConfig.coAuthorName}</div>
                <div className="mt-0.5 text-sm text-white/55">{siteConfig.coAuthorFocus}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={siteConfig.instagramMain}
                    target="_blank"
                    rel="noreferrer"
                    className="trust-pill hover:border-[#ff425d]/50 hover:text-white transition-colors"
                  >
                    Instagram {siteConfig.coAuthorHandle}
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/75">
              Специализируется на AI-агентах и алгоритмической торговле. Разрабатывает автоматизированные системы и внедряет ИИ-решения для бизнеса в РФ/СНГ.
            </p>
          </div>

          {/* Telegram channel card */}
          <a
            href={siteConfig.tgChannel}
            target="_blank"
            rel="noreferrer"
            className="neon-card group flex flex-col justify-between rounded-3xl p-6 transition-all hover:border-[#2ed8ff]/30"
            onClick={() => track("social_click", { platform: "telegram_channel" })}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2ed8ff]/15 text-2xl">
                ✈️
              </div>
              <div>
                <div className="text-base font-black text-white">AI×Business: 1MB3</div>
                <div className="text-xs text-white/50">Telegram-канал</div>
              </div>
              <span className="ml-auto text-xs text-white/40 group-hover:text-white/60 transition-colors">→</span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-3">
              <p className="text-sm text-white/70">
                Публикуем AI-инструменты, кейсы, стратегии монетизации и обновления гайда.
              </p>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-black text-white">{siteConfig.tgChannelSubs}</div>
                <div className="text-[11px] uppercase tracking-wider text-white/45">подписчиков</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="trust-pill">{siteConfig.tgChannelHandle}</span>
              <span className="trust-pill">Бесплатно</span>
            </div>
          </a>
        </div>

        {/* Instagram strip */}
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={siteConfig.instagramMain}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-extrabold text-white/80 transition-all hover:border-[#ff425d]/40 hover:text-white"
            onClick={() => track("social_click", { platform: "instagram_main" })}
          >
            <span className="text-base">📸</span>
            Instagram проекта — @inside1mb3
          </a>
          <a
            href={siteConfig.instagramAuthor}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-extrabold text-white/80 transition-all hover:border-[#ff425d]/40 hover:text-white"
            onClick={() => track("social_click", { platform: "instagram_author" })}
          >
            <span className="text-base">📸</span>
            Instagram автора — @yana__yanoshka
          </a>
        </div>
      </Section>

      <Section
        id="fit"
        title="Кому подходит / не подходит"
        subtitle="Помогает принять решение до оплаты и не завышать ожидания."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="neon-card rounded-3xl p-6">
            <h3 className="text-lg font-black">Подойдёт</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {fit.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="neon-card-red rounded-3xl p-6">
            <h3 className="text-lg font-black">Не подойдёт</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {notFit.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="not-included"
        variant="alt"
        title="Что НЕ входит"
        subtitle="Важно для честных ожиданий и снижения возвратов."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {notIncluded.map((item) => (
            <article key={item} className="rounded-2xl border border-[#ff425d]/30 bg-[#ff425d]/8 p-5 text-sm text-white/85">
              {item}
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="trust"
        title="Проверка перед покупкой"
        subtitle="Короткий чек-лист, чтобы принять решение спокойно и без давления."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {trustChecks.map((item) => (
            <article key={item} className="neon-card rounded-2xl p-5 text-sm text-white/85">
              {item}
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="offer"
        title="Цена и доступ"
        subtitle="Один платёж и мгновенная выдача материалов."
      >
        <div className="cyber-grid rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
            <div>
              <p className="text-sm text-white/65">Продукт</p>
              <h3 className="mt-1 text-2xl font-black text-white">{siteConfig.productName}</h3>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div>
                  <span className="block text-sm text-white/45 line-through">{siteConfig.priceOld}</span>
                  <span className="text-[3.2rem] font-black leading-none text-white">{siteConfig.priceNow}</span>
                </div>
                <div className="rounded-2xl border border-[#ff425d]/35 bg-[#ff425d]/12 px-4 py-2 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#ff425d]/80">Скидка</div>
                  <div className="text-2xl font-black text-[#ff425d]">−50%</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                  ⏰ Скидка действует ещё:
                </div>
                <CountdownTimer />
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>• Формат: {siteConfig.guideFormat}</li>
                <li>• Объём: {siteConfig.guideVolume}</li>
                <li>• Выдача: {siteConfig.guideDelivery}</li>
                <li>• Если сомневаетесь — задайте вопрос в чат, и менеджер подскажет по вашей ситуации.</li>
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="trust-pill">Честный состав</span>
                <span className="trust-pill">Юридические страницы</span>
                <span className="trust-pill">Без скрытых доплат</span>
              </div>
            </div>

            <aside className="rounded-2xl border border-white/15 bg-black/35 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.13em] text-white/55">Checkout trust</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>• Чётко: покупка только цифрового гайда.</li>
                <li>• Поддержка по организационным вопросам после оплаты.</li>
                <li>• Оферта и политика доступны до оплаты.</li>
              </ul>

              <Button className="mt-5 w-full" onClick={() => openStep("offer") }>
                {offerButtonText}
              </Button>
              <Button className="mt-3 w-full" variant="ghost" href="#faq">
                Вопросы перед оплатой
              </Button>

              <p className="mt-4 text-[11px] leading-relaxed text-white/55">
                Нажимая кнопку, вы подтверждаете, что понимаете формат продукта и принимаете условия
                <Link href="/legal/offer" className="mx-1 underline" onClick={() => track("legal_click", { doc: "offer" })}>
                  оферты
                </Link>
                и
                <Link
                  href="/legal/privacy"
                  className="mx-1 underline"
                  onClick={() => track("legal_click", { doc: "privacy" })}
                >
                  политики конфиденциальности
                </Link>
                .
              </p>
            </aside>
          </div>
        </div>
      </Section>

      <Section id="faq" variant="alt" title="FAQ" subtitle="Коротко и по делу перед покупкой.">
        <div className="space-y-3">
          {faq.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.06}>
              <details
                className="faq-item rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors open:border-white/20 open:bg-white/[0.05]"
                onToggle={(e) => {
                  if (e.currentTarget.open) {
                    track("faq_open", { question: item.q });
                  }
                }}
              >
                <summary className="cursor-pointer list-none font-extrabold text-white">{item.q}</summary>
                <p className="mt-3 text-sm text-white/70">{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </Section>

      <section className="relative overflow-hidden py-24">
        {/* Cinematic background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#ff425d]/25 via-transparent to-[#2ed8ff]/25 blur-[90px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,216,255,0.04)_0%,transparent_70%)]" />
        </div>

        <Container>
          <FadeIn>
            <div className="text-center">
              <p className="neon-kicker mb-6">Последний шаг</p>
              <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-black leading-[0.93] tracking-tight">
                Забирайте гайд
                <br />
                <span className="metal-text">и начинайте сегодня</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-white/65">
                Один платёж — мгновенный доступ к PDF, шаблонам и каталогу сервисов.
              </p>

              {/* Price display */}
              <div className="mt-8 flex items-center justify-center gap-5">
                <span className="text-lg text-white/35 line-through">{siteConfig.priceOld}</span>
                <span className="text-[3.5rem] font-black leading-none text-white">{siteConfig.priceNow}</span>
                <span className="rounded-xl border border-[#ff425d]/40 bg-[#ff425d]/15 px-3 py-1.5 text-sm font-black text-[#ff425d]">−50%</span>
              </div>

              {/* Pulsing CTA */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#ff425d]/45 to-[#2ed8ff]/45 blur-[24px] animate-pulse" />
                  <Button size="lg" onClick={() => openStep("final_cta")}>
                    Купить гайд прямо сейчас
                  </Button>
                </div>
                <Button size="lg" variant="ghost" href="#inside">
                  Посмотреть состав
                </Button>
              </div>

              {/* Trust micro-copy */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="trust-pill">Честный состав</span>
                <span className="trust-pill">Без скрытых доплат</span>
                <span className="trust-pill">Оферта открыта</span>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <footer className="mt-12 border-t border-white/10 py-8">
        <Container>
          <div className="flex flex-col gap-6">
            {/* Social row */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.tgChannel}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-white/80 transition-all hover:border-[#2ed8ff]/40 hover:text-white"
                onClick={() => track("social_click", { platform: "tg_channel_footer" })}
              >
                ✈️ {siteConfig.tgChannelHandle} · {siteConfig.tgChannelSubs} подписчиков
              </a>
              <a
                href={siteConfig.instagramMain}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-white/80 transition-all hover:border-[#ff425d]/40 hover:text-white"
                onClick={() => track("social_click", { platform: "ig_main_footer" })}
              >
                📸 @inside1mb3
              </a>
              <a
                href={siteConfig.instagramAuthor}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-extrabold text-white/80 transition-all hover:border-[#ff425d]/40 hover:text-white"
                onClick={() => track("social_click", { platform: "ig_author_footer" })}
              >
                📸 @yana__yanoshka
              </a>
            </div>
          </div>
        </Container>
      </footer>

      {stepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4">
          <div className="w-[min(94vw,580px)] rounded-3xl border border-white/15 bg-gradient-to-b from-[#060b18] to-[#050913] shadow-[0_24px_80px_rgba(0,0,0,.65)]">
            {/* Header */}
            <div className="border-b border-white/10 px-6 py-5 md:px-8 md:py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white md:text-2xl">Подтверждение покупки</h3>
                  <p className="mt-1.5 text-sm text-white/60">Проверьте детали перед оплатой</p>
                </div>
                <button
                  onClick={() => closeStep("modal")}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 md:px-8">
              {/* Product info */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/50">Вы покупаете</div>
                    <div className="mt-1 text-base font-extrabold text-white">{siteConfig.productName}</div>
                    <div className="mt-1 text-sm text-white/70">{siteConfig.productType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40 line-through">{siteConfig.priceOld}</div>
                    <div className="text-2xl font-black text-white">{siteConfig.priceNow}</div>
                  </div>
                </div>
              </div>

              {/* Important notice */}
              <div className="mt-4 rounded-2xl border border-[#ff425d]/20 bg-[#ff425d]/5 p-4">
                <div className="flex gap-3">
                  <span className="text-lg">⚠️</span>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-white">Важно понимать</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                      Это цифровой гайд в PDF, не курс и не персональное сопровождение. Результат зависит от ваших действий.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-5">
                <div className="text-xs font-bold uppercase tracking-wider text-white/50">Способы оплаты</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">💳 Visa</div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">💳 Mastercard</div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">💳 Мир</div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">⚡ СБП</div>
                </div>
              </div>

              {/* Security badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <span>🔒</span>
                  <span>Безопасная оплата</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1">
                  <span>✓</span>
                  <span>Мгновенная выдача</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1">
                  <span>📧</span>
                  <span>Чек на email</span>
                </span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-white/10 px-6 py-5 md:px-8">
              <div className="mb-4">
                <YooKassaPayment />
              </div>
              <Button variant="ghost" onClick={() => closeStep("modal")} className="w-full">
                Вернуться к описанию
              </Button>
              <p className="mt-4 text-center text-[11px] leading-relaxed text-white/45">
                Нажимая кнопку, вы принимаете условия{" "}
                <Link href="/legal/offer" className="underline hover:text-white/70">
                  оферты
                </Link>
                {" "}и{" "}
                <Link href="/legal/privacy" className="underline hover:text-white/70">
                  политики конфиденциальности
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => openStep("sticky_mobile")}
        className="mobile-sticky-cta md:hidden"
      >
        Купить гайд — {siteConfig.priceNow}
      </button>

      <ChatWidget />
      <ExitIntentPopup />
      <LivePurchaseCounter />
      <RecentPurchasePopup />
    </main>
  );
}
