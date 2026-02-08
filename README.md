# GTS Framework - Go and Try Your SaaS Ideas

**Темплейт для быстрого создания SaaS MVP с AI-first подходом.**

Цель: за 1-2 часа с помощью agentic workflow развернуть рабочий SaaS-проект с auth, billing (опционально), и полной инфраструктурой.

---

## 🎯 Для кого это?

Этот репозиторий создан для:

- **Быстрого тестирования идей** - Запустить MVP за час-два, не тратя время на setup
- **Обучения через практику** - Полноценный SaaS stack "из коробки"
- **Agentic workflow** - Оптимизирован под работу с AI-агентами (Cursor, Claude)
- **Гибкости** - Любая фича (billing, trials, onboarding) включается/выключается флагами

## 💡 Ключевая идея

**Не писать бойлерплейт каждый раз.** 

Вместо того чтобы каждый раз настраивать auth, базу, Stripe, миграции - просто склонируй, включи нужные фичи флагами, и занимайся своей бизнес-логикой.

## 🚀 За что отвечает этот темплейт?

### ✅ Уже работает "из коробки"

- **Auth** - Supabase (email/password + Google OAuth)
- **Database** - PostgreSQL через Supabase + миграции (воспроизводимо!)
- **Billing** - Stripe subscriptions + webhooks (опционально)
- **Trials** - 48-hour trial для новых юзеров (опционально)
- **UI** - Tailwind CSS v4 + dark mode + responsive
- **Security** - RLS policies для защиты данных
- **DX** - TypeScript, ESLint, Vitest, hot reload

### 🎚️ Feature Flags - включай что нужно

```bash
# .env.local
NEXT_PUBLIC_ENABLE_BILLING=true    # Stripe subscriptions
NEXT_PUBLIC_ENABLE_TRIALS=true     # 48-hour trials
NEXT_PUBLIC_ENABLE_ONBOARDING=true # Onboarding tour
```

**Варианты использования:**
- `все true` → Полноценный платный SaaS
- `все false` → Бесплатное приложение без ограничений
- `только billing` → Freemium модель
- `только trials` → Demo с ограничением по времени

## 📦 Что внутри?

```
GTS_framework/
├── app/              # Next.js 15 App Router
├── components/       # React компоненты
├── supabase/         # Миграции БД (воспроизводимы!)
│   └── migrations/   # SQL для таблиц + RLS
├── utils/
│   └── features.ts   # Feature flags конфигурация
├── docs/             # Полная документация
└── .cursor/          # AI-оптимизированные rules и skills
```

## ⚡ Быстрый старт

```bash
# 1. Клонируй и установи
git clone <этот-репо> my-mvp
cd my-mvp
npm install

# 2. Подними локальную базу (нужен Docker)
supabase start

# 3. Скопируй ключи из вывода в .env.local
cp .env.example .env.local
# Вставь NEXT_PUBLIC_SUPABASE_URL и ключи из вывода supabase start

# 4. Запусти
npm run dev

# 5. Открой http://localhost:3000
```

**Готово!** Auth работает, база настроена, миграции применены.

👉 **Подробный гайд:** [docs/quickstart.md](./docs/quickstart.md)

## 🎓 Как это использовать?

### Сценарий 1: Быстрый прототип (без billing)

```bash
# .env.local
NEXT_PUBLIC_ENABLE_BILLING=false
NEXT_PUBLIC_ENABLE_TRIALS=false
```

**Результат:** Простое приложение с auth, можно сразу добавлять свою логику.

### Сценарий 2: Full SaaS с оплатой

```bash
# .env.local
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_TRIALS=true

# Добавь Stripe ключи
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Результат:** Trial 48ч → платная подписка → доступ. Stripe webhooks работают.

### Сценарий 3: Agentic development

Используй `.cursor/skills/` и `.cursor/commands/` для автоматизации:

- `/speckit.specify` - Создать спецификацию фичи
- `/speckit.design` - Сгенерировать UI mock
- `/speckit.implement` - Реализовать фичу

## 🔧 Архитектура

### Database Schema (Supabase)

Миграции в `supabase/migrations/`:

- `users` - профили юзеров (soft-delete)
- `subscriptions` - Stripe subscriptions
- `user_trials` - Trial periods
- `user_preferences` - настройки + onboarding

**Важно:** Схема применяется автоматически при `supabase start` или `supabase db push`.

### Feature Flags

Проверка в коде:

```typescript
import { FEATURES } from '@/utils/features';

if (FEATURES.BILLING) {
  // показать Stripe checkout
}

if (FEATURES.TRIALS) {
  // проверить trial status
}
```

### Security

- **RLS** - Row Level Security включен на всех таблицах
- **Service role** - только для webhooks и admin операций
- **User data** - пользователь видит только свои данные

## 📖 Документация

| Документ | Что внутри |
|----------|------------|
| [📖 INDEX.md](./docs/INDEX.md) | Полный индекс документации |
| [⚡ quickstart.md](./docs/quickstart.md) | Setup за 5 шагов + smoke test |
| [🎚️ feature-flags.md](./docs/feature-flags.md) | Как включать/выключать фичи |
| [🗄️ supabase.md](./docs/supabase.md) | Работа с базой и миграциями |
| [🔧 core-implementation.md](./docs/core-implementation.md) | Технические детали |

## 🤖 AI Agent Workflow

Этот репо заточен под работу с AI:

- **`.cursor/commands/`** - Spec Kit команды (`/speckit.specify`, `/speckit.implement`)
- **`.cursor/skills/`** - TDD loop, копирование UI компонентов
- **`.cursor/rules/`** - Правила для React, TypeScript, Supabase, Tailwind
- **Clean structure** - Агенты быстро ориентируются

**Пример:**
```
/speckit.specify user-dashboard
→ Агент создаёт спеку
→ Ревью
→ /speckit.implement
→ Готовая фича с кодом + тестами
```

## 🔑 Ключевые файлы

| Файл | Зачем |
|------|-------|
| `utils/features.ts` | Feature flags конфигурация |
| `supabase/migrations/` | SQL миграции для БД |
| `utils/supabase/` | Client/server Supabase helpers |
| `contexts/AuthContext.tsx` | Auth state + методы |
| `hooks/useSubscription.ts` | Subscription logic |
| `app/api/stripe/webhook/` | Stripe events handler |

## 🛠️ Tech Stack

- **Next.js 15** - App Router, React 19, Server Components
- **TypeScript** - Строгая типизация
- **Supabase** - Auth + PostgreSQL + RLS
- **Stripe** - Payments (опционально)
- **Tailwind CSS v4** - Styling
- **Vitest** - Testing
- **Framer Motion** - Animations

## 🎯 Типичный workflow

1. **Склонировать темплейт** для новой идеи
2. **Запустить** `supabase start && npm run dev`
3. **Настроить флаги** под конкретный MVP
4. **Добавить доменную логику** (твои таблицы, компоненты, API)
5. **Задеплоить** на Vercel + production Supabase

Весь SaaS-скелет уже работает, фокус только на бизнес-логике.

## ⚠️ Что НЕ включено (добавляй по необходимости)

- Email notifications (есть заготовка Supabase email)
- Admin dashboard (только user-facing UI)
- Multi-tenancy (single-tenant по умолчанию)
- Advanced analytics (есть заготовка PostHog)

См. [docs/technical-debt.md](./docs/technical-debt.md) для запланированных улучшений.

## 📝 FAQ

**Q: Это только для платных SaaS?**  
A: Нет, можно выключить billing и использовать просто как auth + база.

**Q: Как добавить свои таблицы в БД?**  
A: Создай новую миграцию: `supabase migration new add_my_table`

**Q: Можно использовать без Stripe?**  
A: Да, установи `NEXT_PUBLIC_ENABLE_BILLING=false`

**Q: Нужно знать Supabase CLI?**  
A: Базово: `supabase start` (запустить), `supabase db reset` (сбросить). Всё.

---

**Made for rapid SaaS prototyping with AI agents** 🚀
