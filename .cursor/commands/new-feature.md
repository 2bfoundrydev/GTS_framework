# Scaffold New Feature

Create the basic file structure for a new feature following GTS Framework conventions.

## Information Needed

Ask the user:
1. Feature name (e.g., "notifications", "dashboard", "profile")
2. Feature type:
   - Page (new route in app/)
   - Component (reusable UI component)
   - API endpoint (new API route)
   - Full feature (page + components + API)

## Scaffolding Steps

### For Page Features

Create:
```
app/[feature-name]/
  page.tsx           # Main page component (server component)
  layout.tsx         # Optional layout wrapper
```

### For Component Features

Create:
```
components/[feature-name]/
  [FeatureName].tsx      # Main component
  [FeatureName]Item.tsx  # Sub-component (if needed)
  types.ts               # TypeScript types
```

### For API Features

Create:
```
app/api/[feature-name]/
  route.ts           # GET/POST/DELETE handlers
```

### For Full Features

Create all of the above plus:
```
hooks/
  use[FeatureName].ts    # Custom hook
contexts/
  [FeatureName]Context.tsx  # Context (if needed)
types/
  [feature-name].ts      # Shared types
```

## File Templates

### Page Template
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '[Feature Name]',
  description: '[Description]',
};

export default async function [FeatureName]Page() {
  return (
    <div>
      <h1>[Feature Name]</h1>
    </div>
  );
}
```

### Component Template
```tsx
'use client';

interface [FeatureName]Props {
  // props
}

export function [FeatureName]({ }: [FeatureName]Props) {
  return (
    <div>
      {/* component */}
    </div>
  );
}
```

### API Route Template
```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withCors } from '@/utils/cors';
import { logger } from '@/utils/logger';

export const GET = withCors(async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Error in [feature-name] API');
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
});
```

### Hook Template
```tsx
'use client';

import { useState, useEffect } from 'react';

export function use[FeatureName]() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch logic
  }, []);

  return { data, isLoading };
}
```

## After Scaffolding

1. Show the created file structure
2. Provide next steps:
   - Implement the actual logic
   - Add types/interfaces
   - Create tests
   - Update routes if needed
