---
name: tdd-loop
description: Test-Driven Development workflow. Write failing tests first, then implement code to pass them. Use when user mentions TDD, test-first, or requests tests before implementation.
---

# TDD Loop - Test-Driven Development

A systematic workflow for building features with tests first, following the Red-Green-Refactor cycle.

## When to Use

Use this skill when:
- User explicitly asks for "TDD" or "test-driven development"
- User requests "write tests first" or "test-first approach"
- User mentions "red-green-refactor"
- Building a new feature that should be thoroughly tested

## TDD Workflow: Red-Green-Refactor

### Phase 1: RED - Write Failing Test

**First step: Create a marker file**
```bash
echo "TDD_MODE=active" > .cursor/scratchpad.md
```

This enables the grind hook. The hook will automatically re-run the agent until all tests pass.

**Then write the test:**

1. Create test file following naming convention:
   - Component tests: `__tests__/ComponentName.test.tsx`
   - Util tests: `__tests__/utilName.test.ts`
   - Hook tests: `__tests__/useHookName.test.tsx`

2. Write a failing test using Vitest syntax:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders the title correctly', () => {
    render(<MyComponent title="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

3. **Run the test to confirm it fails:**
```bash
npx vitest run
```

**CRITICAL**: The test MUST fail first. If it passes without implementation, the test is not valid.

### Phase 2: GREEN - Write Minimal Implementation

Write the **minimum code** needed to make the test pass:

```tsx
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <h1>{title}</h1>;
}
```

**Run tests again:**
```bash
npx vitest run
```

Tests should now pass. If they don't, the grind hook will automatically re-run you to fix the implementation.

### Phase 3: BLUE - Refactor (Optional)

Once tests pass, you can refactor for better code quality:
- Extract reusable logic
- Improve naming
- Optimize performance
- Add edge case handling

**Run tests after refactoring:**
```bash
npx vitest run
```

Tests must still pass after refactoring.

### Phase 4: Done - Remove TDD Mode Marker

When all tests pass and you're done with TDD:
```bash
rm .cursor/scratchpad.md
```

This disables the grind hook.

## Vitest Conventions

### Test Structure
```tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something specific', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = functionUnderTest(input)
    
    // Assert
    expect(result).toBe('expected')
  })

  afterEach(() => {
    // Cleanup after each test
  })
})
```

### Common Matchers
```tsx
expect(value).toBe(expected)              // Strict equality
expect(value).toEqual(expected)           // Deep equality
expect(value).toBeTruthy()                // Truthy check
expect(value).toBeFalsy()                 // Falsy check
expect(value).toBeNull()                  // Null check
expect(value).toBeUndefined()             // Undefined check
expect(array).toContain(item)             // Array contains
expect(string).toMatch(/pattern/)         // Regex match
expect(fn).toThrow()                      // Function throws
```

### React Testing
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Render component
render(<MyComponent prop="value" />)

// Query elements
const button = screen.getByRole('button')
const text = screen.getByText('Hello')
const input = screen.getByLabelText('Name')

// Interact
fireEvent.click(button)
fireEvent.change(input, { target: { value: 'new value' } })

// Wait for async updates
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

## Hook Automation

The `stop` hook (`.cursor/hooks/tdd-grind.mjs`) automatically:
1. Runs after every agent turn
2. Checks if `.cursor/scratchpad.md` contains `TDD_MODE`
3. If yes, runs `npx vitest run`
4. If tests fail, outputs `followup_message` to re-run the agent with failure details
5. If tests pass, outputs `{}` to stop the agent

**Maximum iterations: 5** (safety limit to prevent infinite loops)

## Example TDD Session

User: "Implement a calculator component with TDD"

Agent response:
1. Create `.cursor/scratchpad.md` with `TDD_MODE=active`
2. Create `__tests__/Calculator.test.tsx`:
```tsx
describe('Calculator', () => {
  it('adds two numbers', () => {
    render(<Calculator />)
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('='))
    expect(screen.getByRole('textbox')).toHaveValue('5')
  })
})
```
3. Run `npx vitest run` - test FAILS (expected)
4. Create `components/Calculator.tsx` with minimal implementation
5. Agent finishes turn
6. Hook runs tests - if still failing, agent resumes automatically
7. Loop continues until tests pass
8. Remove `.cursor/scratchpad.md`

## Important Notes

- **Always write tests first** - this is the core of TDD
- **Tests must fail initially** - proves they're actually testing something
- **Write minimal code** - don't over-engineer in the Green phase
- **Run tests frequently** - after every small change
- **The grind hook is automatic** - you don't need to manually re-run yourself
- **Remove TDD mode when done** - prevents the hook from running on unrelated tasks

## Troubleshooting

### Tests won't fail
- Check that you're testing the right thing
- Verify the component/function doesn't already exist
- Make sure test expectations match what you're building

### Grind hook not working
- Verify `.cursor/scratchpad.md` exists with `TDD_MODE`
- Check that tests are actually running (`npx vitest run`)
- Look at Cursor's Hooks output channel for debug info

### Infinite loop
- Safety limit is 5 iterations
- If hitting limit, tests may be flaky or implementation is complex
- Consider breaking down into smaller test cases
