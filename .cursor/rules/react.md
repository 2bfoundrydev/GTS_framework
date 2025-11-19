# React Rules

## Component Structure

### Client Components
```tsx
'use client';

import { useState } from 'react';

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

**Use 'use client' when:**
- Using hooks (useState, useEffect, useContext, etc.)
- Using browser APIs (window, document, etc.)
- Event handlers (onClick, onChange, etc.)
- Third-party libraries that require client-side rendering

### Server Components (Default)
```tsx
// No 'use client' directive needed

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // Can use async/await directly
  const data = await fetchData(params.id);
  
  return <div>{data.title}</div>;
}
```

**Server components by default for:**
- Data fetching
- Database queries
- No interactivity needed

## Hooks Rules

### State Management
```tsx
// Simple state
const [count, setCount] = useState(0);

// With type
const [user, setUser] = useState<User | null>(null);

// With initial function
const [data, setData] = useState(() => computeInitialData());
```

### Effects
```tsx
useEffect(() => {
  // Setup
  const subscription = subscribeToData();
  
  // Cleanup
  return () => {
    subscription.unsubscribe();
  };
}, [dependencies]); // Always specify dependencies
```

### Custom Hooks
```tsx
// hooks/useSubscription.ts
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch logic
  }, []);
  
  return { subscription, isLoading };
}
```

## Context

### Creating Context
```tsx
// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Implementation
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

## Performance

### Memoization
```tsx
// Expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);

// Callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Dynamic Imports
```tsx
// For heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // if needed
});
```

## Forms

```tsx
'use client';

export function LoginForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Submit logic
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Common Patterns

### Loading States
```tsx
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <Content data={data} />;
```

### Conditional Rendering
```tsx
// Use && for simple conditions
{isLoggedIn && <Dashboard />}

// Use ternary for if-else
{isLoggedIn ? <Dashboard /> : <Login />}

// Complex conditions - extract to variable
const shouldShowBanner = user && !user.hasSeenBanner && isPromoActive;
{shouldShowBanner && <PromoBanner />}
```

## Best Practices

1. **Keep components small** - one responsibility per component
2. **Extract reusable logic** to custom hooks
3. **Avoid prop drilling** - use Context or composition
4. **Use fragments** instead of unnecessary divs
5. **Name event handlers** with `handle` prefix: `handleClick`, `handleSubmit`
6. **Co-locate related code** - keep component, styles, and tests together

