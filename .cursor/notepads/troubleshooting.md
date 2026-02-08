# Troubleshooting Log

## 2024-11-20: Turbopack + Pino Build Failure

**Problem:** 
```
Module not found: Can't resolve 'tap'
thread-stream/test/base.test.js requires test dependencies
```

**Root Cause:** 
- Next.js 16 uses Turbopack by default
- thread-stream (pino-pretty dependency) includes test files in npm package
- Turbopack attempts to bundle test files → fails on missing dev deps (tap, desm, fastbench)

**Attempted Solutions:**
1. ❌ Add `thread-stream/test: false` alias - didn't work
2. ❌ Webpack externals for `why-is-node-running` - didn't work
3. ❌ NormalModuleReplacementPlugin stub - didn't work
4. ❌ Install dev dependencies (`why-is-node-running`) - revealed deeper issues
5. ❌ `experimental.turbo: false` in next.config.ts - not recognized in Next.js 16
6. ❌ Remove pino-pretty transport - defeats purpose of Pino

**Final Solution:** Downgrade to Next.js 15
- Turbopack not default in v15
- Webpack handles pino-pretty correctly
- Added upgrade to technical debt for Q2 2025

---

## 2024-11-20: SVG Import Error in Kanban

**Problem:**
```
Error: Element type is invalid: expected a string or class/function but got: object
/kanban page failed to prerender
```

**Root Cause:**
SVG files imported as objects, not React components

**Solution:**
1. Install `@svgr/webpack`
2. Add webpack rule in next.config.ts:
```ts
webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });
  return config;
}
```

**Result:** SVG files now import as React components

---

## 2024-11-20: TypeScript Error in API Route

**Problem:**
```
No value exists in scope for shorthand property 'userId'
app/api/user/delete/route.ts:75
```

**Root Cause:**
Variable `userId` declared inside try block, used in catch block (out of scope)

**Solution:**
Declare `userId` before try block:
```ts
let userId: string | null = null;
try {
  userId = searchParams.get('userId');
  ...
}
```

---

## Template

```markdown
## YYYY-MM-DD: [Issue Title]

**Problem:** 
[Error message or description]

**Root Cause:** 
[Why it happened]

**Attempted Solutions:**
1. ❌/✅ [What was tried]

**Final Solution:**
[What worked]

**Result:** [Outcome]
```

