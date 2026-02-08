---
name: copy-tailadmin-component
description: Step-by-step workflow for copying UI components from TailAdmin PRO library while preserving structure and resolving all dependencies
---

# Copy TailAdmin Component

A systematic workflow for copying components from TailAdmin PRO to the GTS Framework project.

## When to Use

Use this skill when:
- Adding a new UI component from TailAdmin library
- The user mentions "copy from TailAdmin" or "add TailAdmin component"
- Integrating TailAdmin UI elements (dropdown, modal, tabs, etc.)

## Prerequisites

- TailAdmin PRO license (confirmed - we have it)
- TailAdmin source code available locally
- Component name identified

## Step-by-Step Workflow

### Step 1: Identify the Component

Ask the user which component they want to copy, or confirm the component name if already mentioned.

### Step 2: Analyze Dependencies

Open the TailAdmin source file and identify ALL imports:

```tsx
// Example from Dropdown.tsx
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { HorizontalDots } from "@/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
```

Create a dependency list:
- Component files
- Icon files
- Hook files
- Utility files
- Type definitions
- Style files (CSS/SCSS if any)

### Step 3: Check for Existing Files

**CRITICAL**: Before copying anything, check if files already exist:

```bash
ls components/ui/dropdown/
ls icons/
ls hooks/
```

If a file exists → use the existing file, do NOT copy or overwrite.

### Step 4: Copy Component with Structure

Copy files preserving the exact TailAdmin folder structure:

```
TailAdmin: src/components/ui/dropdown/
           ├── Dropdown.tsx
           ├── DropdownItem.tsx
           └── index.ts

GTS:       components/ui/dropdown/
           ├── Dropdown.tsx
           ├── DropdownItem.tsx
           └── index.ts
```

**Do NOT**:
- Adapt imports
- Simplify component structure
- Change folder organization
- Create barrel exports

### Step 5: Recursively Resolve Dependencies

For each copied file, open it and check ITS imports. Repeat until all dependencies are resolved.

Example chain:
```
Dropdown.tsx → imports useClickOutside
useClickOutside.ts → imports { useEffect } from 'react'  ✓ (built-in, stop)
```

### Step 6: Handle External Dependencies

If the component imports external packages:

```tsx
import { clsx } from 'clsx';
```

Check `package.json`. If the package is missing:

```bash
npm install clsx
```

### Step 7: Handle SVG Icons

TailAdmin uses `@svgr/webpack` (already configured in `next.config.ts`).

Copy SVG files to `/icons/` and add exports to `icons/index.tsx`:

```tsx
export { default as HorizontalDots } from './horizontal-dots.svg';
```

### Step 8: Handle Images

Copy images to `public/images/` preserving structure:
- User avatars → `public/images/user/`
- Task images → `public/images/task/`

**Only copy used files**, not entire directories.

### Step 9: Verify Build

Run the build to check for errors:

```bash
npm run build
```

If errors occur, fix TypeScript issues or ESLint warnings (e.g., add `useEffect` for refs in Next.js 15).

### Step 10: Run Linter

```bash
npm run lint
```

Fix any linting errors.

## Completion Checklist

Present this checklist to the user after copying:

- [ ] Main component copied with preserved structure
- [ ] All imports resolved recursively
- [ ] Types copied
- [ ] Styles copied (if any)
- [ ] SVG icons copied and exported
- [ ] Images copied to public/images/
- [ ] External npm packages installed
- [ ] Build successful (`npm run build`)
- [ ] Linter passes (`npm run lint`)

## Common Issues

### "Module not found"
→ Check all imports, copy missing file

### "Type not found"
→ Copy type definitions from `/types/`

### ESLint error: "refs during render"
→ Wrap ref usage in `useEffect`

### Conflicting utility versions
→ Check git diff, use existing version

## Git Commit Template

After successful copy, suggest this commit format:

```bash
git add [files]
git commit -m "Add [ComponentName] from TailAdmin

Dependencies:
- components/ui/[component]/[files]
- icons/[icon-files]
- hooks/[hook-files]
"
```

## Important Notes

- **Never modify `@tailadmin-integration` rule** - it contains static conventions
- **TailAdmin is not updated** - it's a static component source
- **Preserve original imports** - use TailAdmin's import style exactly
- **Check git status first** - avoid duplicating existing files
