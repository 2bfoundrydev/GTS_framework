# Project Log - Architectural Decisions

## 2024-11-20: Next.js Version Decision

**Decision:** Use Next.js 15 instead of 16
**Reason:** Next.js 16 + Turbopack incompatible with pino-pretty (thread-stream test files issue)
**Impact:** Stable production build, downgrade added to TECHNICAL_DEBT.md
**Alternative:** Wait for ecosystem maturity (Q2 2025)

---

## 2024-11-20: Logging Solution

**Decision:** Pino (without pino-pretty transport in production)
**Reason:** 5-10x faster than Winston, JSON output for production
**Implementation:** `utils/logger.ts` with structured logging (logApi, logStripe, logAuth)
**Trade-off:** No colored logs in dev (JSON only)

---

## 2024-11-20: TailAdmin Integration Strategy

**Decision:** Copy components on-demand (not entire library)
**Reason:** 
- Clean bundle (only used components)
- No bloat (~800KB avoided)
- Full control over dependencies
**Process:** Documented in `.cursor/rules/tailadmin-integration.md`
**Trade-off:** Manual dependency tracking for each component

---

## 2024-11-20: SVG Handling

**Decision:** Use @svgr/webpack for SVG imports
**Reason:** Match TailAdmin approach, import SVGs as React components
**Implementation:** Added to next.config.ts webpack config
**Alternative:** Next.js built-in Image component (rejected - less flexible)

---

## Template

```markdown
## YYYY-MM-DD: [Decision Title]

**Decision:** [What was decided]
**Reason:** [Why this approach]
**Impact:** [What changed]
**Trade-off:** [What was sacrificed]
**Alternative:** [What else was considered]
```

