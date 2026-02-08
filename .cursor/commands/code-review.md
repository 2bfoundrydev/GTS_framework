# Code Review Checklist

Run a comprehensive code review on recent changes or specified files.

## Review Areas

### 1. TypeScript & Types
- [ ] All functions have explicit return types
- [ ] No `any` types used (use `unknown` instead)
- [ ] Props interfaces defined for all components
- [ ] Event handlers properly typed
- [ ] No `@ts-ignore` comments

### 2. React Patterns
- [ ] Client components use `'use client'` directive
- [ ] Server components don't use hooks
- [ ] useEffect has dependency array
- [ ] Event handlers have `handle` prefix
- [ ] No prop drilling (use Context if needed)

### 3. Error Handling
- [ ] Try-catch blocks present for async operations
- [ ] User-friendly error messages
- [ ] Errors logged with structured logging
- [ ] No sensitive data exposed in errors

### 4. Performance
- [ ] Large components use dynamic imports
- [ ] Expensive calculations memoized
- [ ] Images use Next.js Image component
- [ ] No unnecessary re-renders

### 5. Security
- [ ] No API keys or secrets in code
- [ ] Input validation present
- [ ] Admin operations use supabaseAdmin
- [ ] CORS configured for API routes

### 6. Code Style
- [ ] Follows existing project patterns
- [ ] Functions are small and focused
- [ ] Descriptive variable names
- [ ] Comments in English
- [ ] No commented-out code

### 7. Testing
- [ ] Edge cases considered
- [ ] Error paths tested
- [ ] Auth flows work correctly

## Output Format

For each issue found, provide:
- File path and line number
- Issue description
- Suggested fix
- Severity (critical / warning / suggestion)

Summarize at the end:
- Total issues found
- Critical issues that must be fixed
- Overall code quality rating
