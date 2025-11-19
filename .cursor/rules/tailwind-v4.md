# Tailwind CSS v4 Rules

## ⚠️ Critical: Only Use Defined Colors from @theme

The project uses **Tailwind v4** with custom colors defined in `app/globals.css`.

### ✅ ALLOWED Colors (defined in @theme)

**Brand Colors (Primary):**
- `brand-25` through `brand-950`
- Most used: `brand-500` (primary), `brand-600` (darker), `brand-400` (lighter)

**Gray Colors:**
- `gray-25` through `gray-950`
- `gray-dark` (#1a2231)

**Blue Light:**
- `blue-light-25` through `blue-light-950`

**Status Colors:**
- Success: `success-25` through `success-950`
- Error: `error-25` through `error-950`
- Warning: `warning-25` through `warning-950`
- Orange: `orange-25` through `orange-950`

**Special:**
- `white`, `black`, `current`, `transparent`
- `theme-pink-500`, `theme-purple-500`

### ❌ NEVER Use These (not defined):

**DO NOT USE:**
- ❌ `primary`, `primary-dark`, `primary-light`, `primary-darker`
- ❌ `slate-*` (use `gray-*` instead)
- ❌ `accent`, `accent-*`
- ❌ Any default Tailwind colors not in @theme

**Instead use:**
- ✅ `bg-brand-500` instead of `bg-primary`
- ✅ `bg-brand-600` instead of `bg-primary-dark`
- ✅ `text-brand-500` instead of `text-primary`
- ✅ `bg-gray-800` instead of `bg-slate-800`
- ✅ `text-gray-900` instead of `text-slate-900`

## Opacity Syntax (v4 New Style)

### ✅ Correct (Tailwind v4):
```tsx
className="bg-brand-500/50"        // 50% opacity
className="text-gray-900/80"       // 80% opacity
className="ring-brand-500/30"      // 30% opacity
```

### ❌ Incorrect (Tailwind v3 - deprecated):
```tsx
className="bg-brand-500 bg-opacity-50"   // ❌ Old syntax
className="text-opacity-80"              // ❌ Don't use
className="ring-opacity-30"              // ❌ Don't use
```

## Custom Shadows (defined in @theme)

**Available:**
- `shadow-theme-xs`, `shadow-theme-sm`, `shadow-theme-md`, `shadow-theme-lg`, `shadow-theme-xl`
- `shadow-subtle` (for buttons)
- `shadow-hover` (for hover states)
- `shadow-focus-ring`
- `shadow-datepicker`, `shadow-slider-navigation`, `shadow-tooltip`

## Dark Mode

**Using system preference:**
```tsx
className="bg-white dark:bg-gray-900"
```

The project uses `@custom-variant dark (@media (prefers-color-scheme: dark))` 
- No need for `.dark` class or ThemeProvider
- Automatically follows system preference

## Custom Utilities (from @theme)

Available custom utilities:
- `@utility no-scrollbar` - hide scrollbars
- `@utility custom-scrollbar` - styled scrollbars
- `@utility menu-item-*` - menu item styles
- Many others in `app/globals.css`

## Important Rules

1. **Always check `app/globals.css` @theme section** before using a color class
2. **Never modify `app/globals.css`** - it's from the reference project
3. **Test in both light and dark modes**
4. **Use semantic color names:** `brand-*` for primary actions, `error-*` for errors, etc.

## Examples

### ✅ Good Button:
```tsx
<button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-subtle hover:shadow-hover">
  Click me
</button>
```

### ✅ Good Card:
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

### ❌ Bad (using undefined colors):
```tsx
<button className="bg-primary hover:bg-primary-dark">     ❌
<div className="bg-slate-800 text-slate-200">            ❌
<span className="text-accent">                           ❌
```

