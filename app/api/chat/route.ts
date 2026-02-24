import { NextResponse } from "next/server";
import { findBestAnswer, knowledgeBase } from "@/lib/knowledge";

export const runtime = "edge";

type Msg = { role: "user" | "assistant"; content: string };
type RateLimitBucket = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __chatRateLimitStore: Map<string, RateLimitBucket> | undefined;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 25;

function getRateLimitStore() {
  if (!globalThis.__chatRateLimitStore) {
    globalThis.__chatRateLimitStore = new Map<string, RateLimitBucket>();
  }

  return globalThis.__chatRateLimitStore;
}

function clientKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  const ip = forwarded || realIp || cfIp || "unknown-ip";
  const ua = (req.headers.get("user-agent") || "unknown-ua").slice(0, 40);
  return `${ip}:${ua}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const store = getRateLimitStore();

  if (store.size > 2_000) {
    for (const [k, bucket] of store.entries()) {
      if (bucket.resetAt <= now) {
        store.delete(k);
      }
    }
  }

  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    store.set(key, fresh);

    return {
      allowed: true,
      remaining: Math.max(0, RATE_LIMIT_MAX - fresh.count),
      retryAfterSec: Math.ceil((fresh.resetAt - now) / 1000),
    };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX - current.count),
    retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

function withRateHeaders(res: NextResponse, remaining: number) {
  res.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)));
  return res;
}

const SALES_SYSTEM_PROMPT =
  "Ты менеджер продаж цифрового гайда 1MB3. Отвечай только по продукту: что входит, кому подходит, что не входит, цена, доступ, формат, возврат. Не обещай доход и не уходи в оффтоп. Если вопрос вне темы продукта — вежливо откажи и верни к теме гайда. Отвечай кратко: 2–6 предложений, по делу, с мягким призывом к следующему шагу.";

const ON_TOPIC_HINTS = [
  "1mb3",
  "гайд",
  "pdf",
  "продукт",
  "что входит",
  "что внутри",
  "что не входит",
  "цена",
  "стоим",
  "сколько",
  "доступ",
  "после оплаты",
  "оплат",
  "куп",
  "возврат",
  "гарант",
  "для кого",
  "подойдет",
  "подойдёт",
  "курс",
  "куратор",
  "настав",
  "бонус",
  "чек",
  "шаблон",
  "план",
  "инструмент",
  "дорого",
  "развод",
  "обман",
  "скам",
];

const SALES_PRODUCT_FACTS = [
  "1MB3 — это цифровой гайд (PDF + чек-листы + шаблоны), а не курс и не кураторство 1:1.",
  "Внутри: 12 направлений монетизации ИИ, план внедрения на 30 дней, шаблон договора и бонус-каталог 200+ сервисов.",
  "Результат зависит от действий клиента. Нельзя обещать гарантированный доход.",
  "Задача менеджера — помочь понять, подходит ли продукт, и мягко подвести к оплате без давления.",
];

function isOnTopic(query: string) {
  return ON_TOPIC_HINTS.some((hint) => query.includes(hint));
}

function ruleBasedSalesAnswer(message: string, bestAnswer?: string | null) {
  const q = message.toLowerCase();

  if (/(цена|стоим|сколько|дорого|дешев)/.test(q)) {
    return "Цена указана в блоке «Цена и доступ» на странице. Это разовый платёж за цифровой гайд 1MB3 с готовой структурой и материалами для внедрения. Если хотите, помогу понять, окупится ли он под вашу задачу.";
  }

  if (/(что входит|что внутри|состав|получу|модул)/.test(q)) {
    return "Внутри: PDF-гайд 2026, 12 направлений монетизации ИИ, план на 30 дней, чек-листы, шаблон договора и бонус-каталог 200+ сервисов. Если нужно, могу коротко разобрать, с какого блока вам лучше начать.";
  }

  if (/(курс|урок|куратор|настав|созвон)/.test(q)) {
    return "Это не курс и не личное наставничество. Формат — практический цифровой гайд, который вы внедряете в удобном темпе. Если вам важно, подскажу, подойдёт ли такой формат именно вам.";
  }

  if (/(развод|обман|скам|гарант)/.test(q)) {
    return "Позиционирование прозрачное: на странице чётко описано, что входит и что не входит. Гайд не обещает гарантированный доход — результат зависит от вашей ниши и внедрения. Могу помочь оценить реалистичность под ваш текущий уровень.";
  }

  if (bestAnswer) {
    return `${bestAnswer}\n\nЕсли хотите, помогу связать это с вашей ситуацией и понять, стоит ли брать гайд сейчас.`;
  }

  return "Я могу помочь по продукту 1MB3: состав, формат, цена, доступ после оплаты, кому подходит и что не входит. Задайте один конкретный вопрос — отвечу как менеджер по делу.";
}

async function llmAnswer(messages: Msg[], contextHint?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const base =
    process.env.OPENROUTER_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    "https://openrouter.ai/api/v1";
  const model =
    process.env.OPENROUTER_MODEL ??
    process.env.OPENAI_MODEL ??
    "deepseek/deepseek-r1-0528:free";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (base.includes("openrouter.ai")) {
    headers["HTTP-Referer"] = process.env.OPENROUTER_HTTP_REFERER ?? "http://localhost:3000";
    headers["X-Title"] = process.env.OPENROUTER_APP_NAME ?? "1MB3 Guide Sales Assistant";
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18_000);

    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: SALES_SYSTEM_PROMPT,
          },
          {
            role: "system",
            content: `Факты по продукту:\n- ${SALES_PRODUCT_FACTS.join("\n- ")}\n${
              contextHint ? `Контекст по вопросу клиента: ${contextHint}` : ""
            }`,
          },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 380,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content as string | undefined;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const rate = checkRateLimit(clientKey(req));
  if (!rate.allowed) {
    const limited = NextResponse.json(
      {
        answer:
          "Слишком много запросов за короткое время. Подождите немного и задайте вопрос снова — я на связи.",
        related: ["Что входит", "Сколько стоит", "Как получить доступ"],
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSec),
        },
      }
    );
    return withRateHeaders(limited, rate.remaining);
  }

  try {
    const body = await req.json().catch(() => null);
    const message = (body?.message ?? "").toString().slice(0, 2000);
    const history = ((body?.history ?? []) as Msg[])
      .filter((m) => m?.role === "user" || m?.role === "assistant")
      .map((m) => ({ role: m.role, content: (m.content ?? "").toString().slice(0, 1200) }));

    if (!message.trim()) {
      return withRateHeaders(
        NextResponse.json({
          answer:
            "Задайте, пожалуйста, вопрос по гайду 1MB3: что входит, кому подходит, цена, доступ или условия.",
          related: ["Что входит", "Сколько стоит", "Как получить доступ"],
        }),
        rate.remaining
      );
    }

    const lower = message.toLowerCase();

    // 1) Мини-поиск по базе знаний
    const best = findBestAnswer(message);

    const onTopic = Boolean(best) || isOnTopic(lower);
    if (!onTopic) {
      return withRateHeaders(
        NextResponse.json({
          answer:
            "Я отвечаю только по продукту 1MB3: состав гайда, формат, доступ после оплаты, условия и кому подходит. Если хотите, помогу выбрать, подойдёт ли гайд под вашу ситуацию.",
          related: ["Что входит", "Кому подходит", "Как получить доступ"],
        }),
        rate.remaining
      );
    }

    const fallback =
      "Я могу подсказать по гайду 1MB3: что входит, кому подходит, что не входит, как получить доступ после оплаты. Сформулируйте вопрос чуть конкретнее (например: «что внутри гайда?»).";

    const baseAnswer =
      best?.answer ??
      (lower.includes("цена") || lower.includes("сто")
        ? "Цена указана в блоке «Цена и доступ» на странице. Там же описано, что именно входит в покупку цифрового гайда."
        : null) ??
      null;

    let answer =
      (await llmAnswer(
        [...history.slice(-6), { role: "user", content: message }],
        baseAnswer ?? undefined
      )) ?? ruleBasedSalesAnswer(message, baseAnswer) ?? fallback;

    if (!answer) answer = fallback;

    if (answer && !answer.toLowerCase().includes("подойд")) {
      answer = `${answer}\n\nЕсли хотите, помогу понять, подойдёт ли гайд именно под вашу задачу.`;
    }

    const related = best
      ? knowledgeBase
          .filter((k) => k.id !== best.id)
          .slice(0, 3)
          .map((k) => k.title)
      : ["Что входит", "Как получить доступ", "Что не входит"];

    return withRateHeaders(NextResponse.json({ answer, related }), rate.remaining);
  } catch (error) {
    console.error("[chat_api_error]", error instanceof Error ? error.message : "unexpected");

    return withRateHeaders(
      NextResponse.json(
        {
          answer:
            "Сервис временно перегружен. Попробуйте повторить вопрос через минуту — я помогу по продукту 1MB3.",
          related: ["Что входит", "Сколько стоит", "Как получить доступ"],
        },
        { status: 500 }
      ),
      rate.remaining
    );
  }
}
