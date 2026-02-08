---
description: Generate a custom checklist for the current feature based on user requirements.
scripts:
  sh: scripts/bash/check-prerequisites.sh --json
---

## Checklist Purpose: "Unit Tests for English"

**CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate the quality, clarity, and completeness of requirements in a given domain.

**NOT for verification/testing**:
- NOT "Verify the button clicks correctly"
- NOT "Test error handling works"

**FOR requirements quality validation**:
- "Are visual hierarchy requirements defined for all card types?" (completeness)
- "Is 'prominent display' quantified with specific sizing/positioning?" (clarity)
- "Are hover state requirements consistent across all interactive elements?" (consistency)

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Execution Steps

1. **Setup**: Run `{SCRIPT}` from repo root and parse JSON for FEATURE_DIR and AVAILABLE_DOCS list.

2. **Clarify intent (dynamic)**: Derive up to THREE contextual clarifying questions from the user's phrasing + extracted signals from spec/plan/tasks.

3. **Understand user request**: Combine `$ARGUMENTS` + clarifying answers:
   - Derive checklist theme (e.g., security, review, deploy, ux)
   - Map focus selections to category scaffolding

4. **Load feature context**: Read from FEATURE_DIR: spec.md, plan.md (if exists), tasks.md (if exists).

5. **Generate checklist** - Create "Unit Tests for Requirements":
   - Create `FEATURE_DIR/checklists/` directory if it doesn't exist
   - Generate unique checklist filename based on domain (e.g., `ux.md`, `api.md`, `security.md`)
   - Number items sequentially starting from CHK001
   - Each `/speckit.checklist` run creates a NEW file (never overwrites existing checklists)

   **Category Structure**: Group items by requirement quality dimensions:
   - Requirement Completeness
   - Requirement Clarity
   - Requirement Consistency
   - Acceptance Criteria Quality
   - Scenario Coverage
   - Edge Case Coverage
   - Non-Functional Requirements
   - Dependencies & Assumptions
   - Ambiguities & Conflicts

   **ITEM STRUCTURE**: Each item should follow this pattern:
   - Question format asking about requirement quality
   - Focus on what's WRITTEN (or not written) in the spec/plan
   - Include quality dimension in brackets [Completeness/Clarity/Consistency/etc.]
   - Reference spec section `[Spec §X.Y]` when checking existing requirements

6. **Structure Reference**: Generate the checklist following the canonical template in `templates/checklist-template.md`.

7. **Report**: Output full path to created checklist, item count.
