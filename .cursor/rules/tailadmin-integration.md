# TailAdmin Integration Rules

## Контекст
- У нас есть лицензия на TailAdmin PRO
- TailAdmin - наша UI библиотека компонентов
- Копируем компоненты по мере надобности (не всё сразу)

## Подход: Copy-on-Demand

### 1. Определение зависимостей

Когда копируем новый компонент из TailAdmin:

```bash
# Шаг 1: Открыть исходный файл в TailAdmin
# Шаг 2: Найти все импорты:
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { HorizontalDots } from "@/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
```

### 2. Проверка существующих файлов

**КРИТИЧНО:** Перед копированием проверить git status и существующие файлы:

```bash
# Проверить, есть ли уже эти файлы
ls components/ui/dropdown/
ls icons/
ls hooks/
```

**Если файл существует → НЕ копировать, использовать существующий**

### 3. Копирование структуры

Копировать **полностью с сохранением структуры папок:**

```bash
# TailAdmin структура
src/components/ui/dropdown/
├── Dropdown.tsx
├── DropdownItem.tsx
└── index.ts

# Копировать в GTS как есть
components/ui/dropdown/
├── Dropdown.tsx
├── DropdownItem.tsx
└── index.ts
```

**НЕ адаптировать, НЕ упрощать, НЕ менять импорты.**

### 4. Рекурсивная проверка зависимостей

После копирования файла, открыть его и проверить ЕГО импорты:

```tsx
// Скопировали Dropdown.tsx
// Открываем его и видим:
import { cn } from "@/utils/cn";

// → Нужно скопировать utils/cn.ts
// → Открываем cn.ts и проверяем его импорты
// → Повторяем до конца цепочки
```

### 5. NPM зависимости

Если файл импортирует внешние пакеты:

```tsx
import { clsx } from 'clsx';
```

Проверить `package.json` → если нет, установить:

```bash
npm install clsx
```

### 6. TypeScript типы

Копировать типы вместе с компонентами:

```bash
# Если компонент использует
import type { DropdownProps } from './types';

# Копировать
components/ui/dropdown/types.ts
```

### 7. Стили

Копировать все связанные CSS/SCSS файлы:

```bash
# Если есть
Dropdown.module.css
Dropdown.scss

# Копировать вместе с компонентом
```

### 8. SVG иконки

TailAdmin использует @svgr/webpack для импорта SVG как React компонентов.

**Установлено:** `@svgr/webpack` (devDependency)

**next.config.ts** уже настроен:

```ts
webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });
  return config;
}
```

Копировать SVG файлы в `/icons/` и экспортировать через `icons/index.tsx`.

### 9. Изображения (JPG/PNG)

Копировать изображения из `tailAdmin/public/images/` в `public/images/`.

**Структура:**
```
public/images/
├── user/        # Аватары пользователей
└── task/        # Изображения задач/проектов
```

**Копировать только используемые файлы**, не всю папку.

## Чеклист для копирования

- [ ] Проверить git status (нет ли уже этих файлов)
- [ ] Скопировать основной компонент
- [ ] Скопировать все импорты компонента
- [ ] Рекурсивно проверить импорты зависимостей
- [ ] Скопировать типы
- [ ] Скопировать стили (если есть)
- [ ] Скопировать SVG иконки (если есть)
- [ ] Обновить icons/index.tsx (добавить экспорты)
- [ ] Скопировать изображения (JPG/PNG) в public/images/
- [ ] Установить npm пакеты (если нужны)
- [ ] Запустить `npm run build` для проверки
- [ ] Проверить linter: `npm run lint`

## Структура папок

```
GTS_framework/
├── components/
│   ├── ui/               # UI компоненты из TailAdmin
│   │   ├── dropdown/
│   │   ├── modal/
│   │   └── tabs/
│   └── [feature]/        # Фича-компоненты (kanban, etc)
├── icons/                # Иконки из TailAdmin
├── hooks/                # Хуки из TailAdmin
├── utils/                # Утилиты из TailAdmin
└── types/                # Типы из TailAdmin
```

## Импорты в компонентах

Использовать **оригинальные** импорты TailAdmin:

```tsx
// ✅ Правильно (как в TailAdmin)
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { HorizontalDots } from "@/icons";

// ❌ Неправильно (адаптированные)
import Dropdown from '@/components/ui/Dropdown';
```

## Обновления TailAdmin

**Не обновляем.** TailAdmin - статичный источник компонентов.

Если нужен новый компонент из новой версии → копируем как новый.

## Недопустимые действия

- ❌ Адаптировать импорты под свою структуру
- ❌ Упрощать компоненты ("убрать лишнее")
- ❌ Заменять зависимости на свои аналоги
- ❌ Копировать весь `/components/ui/` сразу
- ❌ Создавать barrel exports (`index.ts` с `export *`)
- ❌ Дублировать уже существующие файлы

## Допустимые изменения

**Только после копирования и проверки билда:**

- ✅ Исправить TypeScript ошибки (если несовместимо с Next.js 15)
- ✅ Добавить `useEffect` для refs (Next.js 15 ESLint правило)
- ✅ Обновить пути к изображениям (если нужно)

## Пример: Копирование Dropdown

```bash
# 1. Анализ зависимостей
tailAdmin/src/components/ui/dropdown/Dropdown.tsx:
  → @/components/ui/dropdown/DropdownItem
  → @/icons/HorizontalDots
  → @/hooks/useClickOutside

# 2. Проверка существующих
ls components/ui/dropdown/  # не существует
ls icons/                   # пусто
ls hooks/                   # есть другие хуки

# 3. Копирование
cp tailAdmin/src/components/ui/dropdown/* → components/ui/dropdown/
cp tailAdmin/src/icons/HorizontalDots.tsx → icons/
cp tailAdmin/src/hooks/useClickOutside.ts → hooks/

# 4. Проверка зависимостей useClickOutside
cat hooks/useClickOutside.ts
# Использует только React → ок

# 5. Билд
npm run build  # ✅ Успешно
```

## Git commit message

```bash
git add components/ui/dropdown icons/HorizontalDots.tsx hooks/useClickOutside.ts
git commit -m "Add Dropdown component from TailAdmin

Dependencies:
- components/ui/dropdown/Dropdown.tsx
- components/ui/dropdown/DropdownItem.tsx
- icons/HorizontalDots.tsx
- hooks/useClickOutside.ts
"
```

## Troubleshooting

### Ошибка: "Module not found"
→ Проверить все импорты, скопировать недостающий файл

### Ошибка: "Type not found"
→ Скопировать файл с типами из `/types/`

### ESLint ошибка: "refs during render"
→ Обернуть `drop(ref)` в `useEffect`

### Конфликт версий утилит
→ Проверить git diff, использовать существующую версию

