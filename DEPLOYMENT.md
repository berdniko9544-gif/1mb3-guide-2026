# 🚀 Развертывание сайта на хостинге

## Вариант 1: Vercel (Рекомендуется) ⭐

Самый простой способ для Next.js проектов.

### Шаги:

1. **Создайте аккаунт на Vercel**
   - Перейдите на https://vercel.com
   - Зарегистрируйтесь через GitHub/GitLab/Bitbucket

2. **Подключите репозиторий**
   ```bash
   # Если еще не создан Git репозиторий:
   git init
   git add .
   git commit -m "Initial commit"
   
   # Создайте репозиторий на GitHub и загрузите код:
   git remote add origin https://github.com/ваш-username/ваш-repo.git
   git push -u origin main
   ```

3. **Импортируйте проект в Vercel**
   - Нажмите "Add New Project"
   - Выберите ваш репозиторий
   - Vercel автоматически определит Next.js
   - Нажмите "Deploy"

4. **Настройте переменные окружения** (если нужны)
   - В настройках проекта → Environment Variables
   - Добавьте `NEXT_PUBLIC_SITE_URL=https://ваш-домен.vercel.app`

5. **Готово!** 
   - Сайт доступен по адресу `https://ваш-проект.vercel.app`
   - Автоматические деплои при каждом push в main

### Подключение своего домена:
- Settings → Domains → Add Domain
- Следуйте инструкциям для настройки DNS

---

## Вариант 2: Netlify

Альтернатива Vercel с похожим процессом.

### Шаги:

1. **Зарегистрируйтесь на Netlify**
   - https://netlify.com

2. **Создайте `netlify.toml` в корне проекта:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Подключите репозиторий**
   - Add new site → Import from Git
   - Выберите репозиторий
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Deploy**

---

## Вариант 3: VPS (Российские хостинги)

Для полного контроля и работы в РФ.

### Рекомендуемые провайдеры:
- Timeweb
- Beget
- Reg.ru
- FirstVDS

### Шаги развертывания:

1. **Подключитесь к серверу по SSH:**
   ```bash
   ssh root@ваш-ip
   ```

2. **Установите Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Установите PM2 (менеджер процессов):**
   ```bash
   npm install -g pm2
   ```

4. **Клонируйте проект:**
   ```bash
   cd /var/www
   git clone https://github.com/ваш-username/ваш-repo.git
   cd ваш-repo
   ```

5. **Установите зависимости и соберите:**
   ```bash
   npm install
   npm run build
   ```

6. **Запустите с PM2:**
   ```bash
   pm2 start npm --name "1mb3-site" -- start
   pm2 save
   pm2 startup
   ```

7. **Настройте Nginx как reverse proxy:**
   ```bash
   sudo nano /etc/nginx/sites-available/1mb3
   ```

   Добавьте конфигурацию:
   ```nginx
   server {
       listen 80;
       server_name ваш-домен.ru;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Активируйте конфигурацию:
   ```bash
   sudo ln -s /etc/nginx/sites-available/1mb3 /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Установите SSL сертификат (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d ваш-домен.ru
   ```

---

## Вариант 4: Railway

Простой хостинг с бесплатным тарифом.

### Шаги:

1. **Зарегистрируйтесь на Railway**
   - https://railway.app

2. **Создайте новый проект**
   - New Project → Deploy from GitHub repo

3. **Railway автоматически:**
   - Определит Next.js
   - Установит зависимости
   - Соберет проект
   - Запустит на порту

4. **Получите URL**
   - Settings → Generate Domain

---

## Вариант 5: Docker (Универсальный)

Для любого хостинга с поддержкой Docker.

### Создайте `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Создайте `.dockerignore`:

```
node_modules
.next
.git
*.log
```

### Обновите `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

### Соберите и запустите:

```bash
docker build -t 1mb3-site .
docker run -p 3000:3000 1mb3-site
```

---

## Чек-лист перед деплоем

- [ ] Проверьте `lib/config.ts` - все URL и контакты актуальны
- [ ] Убедитесь, что `NEXT_PUBLIC_SITE_URL` установлен правильно
- [ ] Проверьте `paymentUrl` в конфиге
- [ ] Протестируйте локально: `npm run build && npm start`
- [ ] Проверьте `.gitignore` - не коммитите `.env` файлы
- [ ] Настройте analytics (если используете)
- [ ] Проверьте мобильную версию
- [ ] Протестируйте все формы и кнопки

---

## Переменные окружения

Создайте `.env.local` (не коммитить в Git!):

```env
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
NEXT_PUBLIC_PAYMENT_URL=https://ваша-платежная-система.ru
```

На хостинге добавьте эти переменные в настройках проекта.

---

## Мониторинг и обновления

### Vercel/Netlify:
- Автоматические деплои при push в main
- Просмотр логов в dashboard
- Rollback к предыдущей версии одним кликом

### VPS:
```bash
# Обновление проекта
cd /var/www/ваш-repo
git pull
npm install
npm run build
pm2 restart 1mb3-site

# Просмотр логов
pm2 logs 1mb3-site

# Мониторинг
pm2 monit
```

---

## Оптимизация производительности

1. **Включите кэширование в Nginx:**
   ```nginx
   location /_next/static {
       alias /var/www/ваш-repo/.next/static;
       expires 365d;
       access_log off;
   }
   ```

2. **Настройте CDN** (Cloudflare бесплатно)

3. **Оптимизируйте изображения:**
   - Используйте WebP формат
   - Next.js Image component уже оптимизирует

4. **Включите Gzip/Brotli сжатие**

---

## Поддержка

Если возникли проблемы:
1. Проверьте логи: `npm run build` локально
2. Убедитесь, что все зависимости установлены
3. Проверьте версию Node.js (нужна 18+)
4. Очистите кэш: `rm -rf .next node_modules && npm install`

## Рекомендация

**Для быстрого старта:** Используйте Vercel (вариант 1)
**Для РФ/СНГ с полным контролем:** VPS (вариант 3)
**Для экспериментов:** Railway (вариант 4)
