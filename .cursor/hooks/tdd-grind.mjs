#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Read input from stdin
let inputData = '';
process.stdin.setEncoding('utf8');

for await (const chunk of process.stdin) {
  inputData += chunk;
}

try {
  const input = JSON.parse(inputData);
  const { status, loop_count = 0 } = input;

  // Bail if agent was aborted or errored
  if (status === 'aborted' || status === 'error') {
    console.log(JSON.stringify({}));
    process.exit(0);
  }

  // Safety limit: max 5 iterations
  if (loop_count >= 5) {
    console.log(JSON.stringify({
      followup_message: '⚠️  TDD grind loop reached maximum iterations (5). Tests are still failing. Please review the test failures and implementation manually.'
    }));
    process.exit(0);
  }

  // Check if TDD mode is active by looking for .cursor/scratchpad.md with TDD_MODE marker
  const scratchpadPath = '.cursor/scratchpad.md';
  if (!existsSync(scratchpadPath)) {
    // TDD mode not active, exit silently
    console.log(JSON.stringify({}));
    process.exit(0);
  }

  const scratchpadContent = readFileSync(scratchpadPath, 'utf-8');
  if (!scratchpadContent.includes('TDD_MODE')) {
    // TDD mode not active, exit silently
    console.log(JSON.stringify({}));
    process.exit(0);
  }

  // TDD mode is active - run tests
  let testOutput = '';
  let testExitCode = 0;

  try {
    testOutput = execSync('npx vitest run --reporter=verbose', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 60000 // 60 second timeout
    });
  } catch (error) {
    testExitCode = error.status || 1;
    testOutput = error.stdout || error.stderr || error.message;
  }

  // If tests passed (exit code 0), stop the loop
  if (testExitCode === 0) {
    console.log(JSON.stringify({}));
    process.exit(0);
  }

  // Tests failed - extract relevant failure info and continue loop
  const iteration = loop_count + 1;
  const failureLines = testOutput
    .split('\n')
    .filter(line => 
      line.includes('FAIL') || 
      line.includes('expected') || 
      line.includes('received') ||
      line.includes('AssertionError') ||
      line.includes('Error:')
    )
    .slice(0, 20) // Limit to first 20 relevant lines
    .join('\n');

  const message = `🔴 Tests still failing (iteration ${iteration}/5).

Test output:
\`\`\`
${failureLines || testOutput.slice(0, 500)}
\`\`\`

Fix the failing tests and run \`npx vitest run\` to verify. The implementation needs to be adjusted to make the tests pass.`;

  console.log(JSON.stringify({
    followup_message: message
  }));
  process.exit(0);

} catch (error) {
  // If there's an error parsing input or running tests, exit silently
  console.error('Hook error:', error.message);
  console.log(JSON.stringify({}));
  process.exit(0);
}
