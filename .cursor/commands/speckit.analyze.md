---
description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
scripts:
  sh: scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Identify inconsistencies, duplications, ambiguities, and underspecified items across the three core artifacts (`spec.md`, `plan.md`, `tasks.md`) before implementation. This command MUST run only after `/speckit.tasks` has successfully produced a complete `tasks.md`.

## Operating Constraints

**STRICTLY READ-ONLY**: Do **not** modify any files. Output a structured analysis report. Offer an optional remediation plan (user must explicitly approve before any follow-up editing commands would be invoked manually).

**Constitution Authority**: The project constitution (`/memory/constitution.md`) is **non-negotiable** within this analysis scope.

## Execution Steps

### 1. Initialize Analysis Context

Run `{SCRIPT}` once from repo root and parse JSON for FEATURE_DIR and AVAILABLE_DOCS. Derive absolute paths:

- SPEC = FEATURE_DIR/spec.md
- PLAN = FEATURE_DIR/plan.md
- TASKS = FEATURE_DIR/tasks.md

Abort with an error message if any required file is missing.

### 2. Load Artifacts

**From spec.md:** Overview, Functional Requirements, Non-Functional Requirements, User Stories, Edge Cases
**From plan.md:** Architecture/stack, Data Model references, Phases, Technical constraints
**From tasks.md:** Task IDs, Descriptions, Phase grouping, Parallel markers [P], Referenced file paths
**From constitution:** Load `/memory/constitution.md` for principle validation

### 3. Build Semantic Models

- **Requirements inventory**: Each requirement with a stable key
- **User story/action inventory**: Discrete user actions with acceptance criteria
- **Task coverage mapping**: Map each task to one or more requirements or stories
- **Constitution rule set**: Extract principle names and MUST/SHOULD statements

### 4. Detection Passes

Limit to 50 findings total.

- **A. Duplication Detection**: Near-duplicate requirements
- **B. Ambiguity Detection**: Vague adjectives, unresolved placeholders
- **C. Underspecification**: Missing objects or outcomes, unmapped tasks
- **D. Constitution Alignment**: Conflicts with MUST principles
- **E. Coverage Gaps**: Requirements with zero tasks, tasks with no requirement
- **F. Inconsistency**: Terminology drift, conflicting requirements, ordering contradictions

### 5. Severity Assignment

- **CRITICAL**: Violates constitution MUST, missing core artifact, zero coverage on core requirement
- **HIGH**: Duplicate/conflicting requirement, ambiguous security/performance attribute
- **MEDIUM**: Terminology drift, missing non-functional task coverage
- **LOW**: Style/wording improvements, minor redundancy

### 6. Produce Analysis Report

Output a Markdown report with: findings table, coverage summary, constitution alignment issues, unmapped tasks, metrics.

### 7. Provide Next Actions

- If CRITICAL issues: Recommend resolving before `/speckit.implement`
- If only LOW/MEDIUM: User may proceed

### 8. Offer Remediation

Ask the user: "Would you like me to suggest concrete remediation edits for the top N issues?" (Do NOT apply them automatically.)
