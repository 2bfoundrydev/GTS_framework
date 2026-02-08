---
description: Generate UI specification and design preview page from approved feature spec, before implementation planning.
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
scripts:
  sh: .specify/scripts/check-prerequisites.sh --json --paths-only
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Generate UI design artifacts AFTER feature spec approval and BEFORE implementation planning. This ensures UX decisions are visible and validated early.

## Execution Flow

### 1. Load feature context

Run `{SCRIPT}` from repo root and parse JSON for `FEATURE_DIR` and `FEATURE_SPEC`.

If the script fails or `FEATURE_SPEC` doesn't exist, instruct user to run `/speckit.specify` first.

### 2. Read the approved feature spec

Load `FEATURE_SPEC` (specs/<feature-id>/spec.md) and extract:
- User stories with acceptance criteria
- Functional requirements
- Key entities and data
- Edge cases
- Success criteria

### 3. Analyze UI requirements

From the spec, identify:
- **Routes/pages** needed (derive from user stories and acceptance scenarios)
- **Components** required (forms, lists, cards, modals, etc.)
- **Layout sections** per page (header, sidebar, main content, footer)
- **UI states** per page/component:
  - Empty state (no data)
  - Loading state (fetching data)
  - Error state (failed to load)
  - Success state (data displayed)
- **Form fields** with validation rules (if forms present)
- **Permissions** (if multi-role or conditional visibility)
- **Non-goals** (explicitly what UI is NOT in scope)

### 4. Check for ambiguities

If the spec leaves UI decisions unclear (e.g., "display tasks" without specifying list vs grid vs table), do NOT guess:
- Create an **Open Questions** section in the UI spec
- List each ambiguity as a numbered question with 2-3 reasonable options
- STOP and report that design requires clarification before preview generation

### 5. Generate UI specification

Create `specs/<feature-id>/ui.md` with this structure:

```markdown
# UI Specification: [FEATURE NAME]

**Feature**: [link to spec.md]  
**Created**: [DATE]  
**Status**: Draft

## Pages & Routes

### Page 1: [Route Path]

**Purpose**: [What this page does]

**Layout sections**:
- Header: [description]
- Main: [description]
- Footer: [description]

**Components**:
- [ComponentName]: [purpose and key props]
- [ComponentName]: [purpose and key props]

**UI States**:
- Empty: [what user sees when no data]
- Loading: [loading indicator placement]
- Error: [error message display]
- Success: [normal data display]

**Fields** (if form present):
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Email | text | email format | Yes |
| Name  | text | 2-50 chars | Yes |

---

[Repeat for each page]

## Shared Components

[List any reusable components across pages]

## Non-Goals

- [Explicitly what UI is NOT included in this feature]

## Open Questions

[Only if ambiguities found - numbered list with options]
```

### 6. Generate preview page

Create `app/preview/<feature-id>/page.tsx`:

**Requirements**:
- **No API calls** - use hardcoded mock data only
- **No backend integration** - no real state, no server actions
- **No auth** - page is public
- **Render all UI states** via tabs or toggle buttons (Empty/Loading/Error/Success)
- **Banner**: clear "Design Preview (non-production)" notice at top
- **Structure**: match the layout/sections from ui.md
- **Components**: use existing project components from `components/` where possible
- **Styling**: use Tailwind classes consistent with project (brand-500, shadow-theme-md, etc.)
- **Controls**: buttons/inputs can be clickable/typable but show alert("Mock action - no backend") or similar

**Template structure**:

```typescript
'use client';

import { useState } from 'react';

export default function Preview<FeatureName>() {
  const [uiState, setUiState] = useState<'empty' | 'loading' | 'error' | 'success'>('success');

  // Mock data
  const mockData = { /* ... */ };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Design Preview Banner */}
      <div className="bg-amber-500 text-white py-2 px-4 text-center font-semibold">
        Design Preview (non-production) - Feature: <feature-name>
      </div>

      {/* UI State Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2">
          <button onClick={() => setUiState('empty')} 
                  className={uiState === 'empty' ? 'bg-brand-500 text-white' : 'bg-gray-200'}>
            Empty
          </button>
          <button onClick={() => setUiState('loading')} 
                  className={uiState === 'loading' ? 'bg-brand-500 text-white' : 'bg-gray-200'}>
            Loading
          </button>
          <button onClick={() => setUiState('error')} 
                  className={uiState === 'error' ? 'bg-brand-500 text-white' : 'bg-gray-200'}>
            Error
          </button>
          <button onClick={() => setUiState('success')} 
                  className={uiState === 'success' ? 'bg-brand-500 text-white' : 'bg-gray-200'}>
            Success
          </button>
        </div>
      </div>

      {/* Actual UI Preview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {uiState === 'empty' && <EmptyState />}
        {uiState === 'loading' && <LoadingState />}
        {uiState === 'error' && <ErrorState />}
        {uiState === 'success' && <SuccessState mockData={mockData} />}
      </div>
    </div>
  );
}
```

### 7. Report completion

Output:
- Path to `specs/<feature-id>/ui.md`
- Path to `app/preview/<feature-id>/page.tsx`
- Local URL to open preview: `http://localhost:3000/preview/<feature-id>`
- If Open Questions exist, warn user to resolve them before proceeding to `/speckit.plan`
- Suggest next step: `/speckit.plan` (after design approval)

## Rules

- Do not invent functionality beyond approved spec
- Do not change acceptance criteria
- Stop on ambiguities - add Open Questions, do not guess
- No new dependencies
- Keep preview isolated (no production route imports)
- All mock data must be inline in preview page
