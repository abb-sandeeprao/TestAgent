---
name: pr-change-summary
description: >
  Produce a reviewer-friendly summary document for a Pull Request or worktree's
  uncommitted changes in the GraphicsModelEditor package: problem being solved,
  areas of interest, critical areas requiring careful review, assumptions made,
  and a plain-language explanation of the diff. Use when asked to "summarize
  this PR", "explain these changes for review", "write a review doc", or
  "document this worktree's changes".
---

# PR / Worktree Change Summary Skill

## Purpose

Reviewers should not have to reconstruct intent from a raw diff. This skill
produces a single Markdown document that explains **why** a change exists,
**what** to look at closely, and **what was assumed**, grounded in the actual
diff — never generic boilerplate.

## Inputs to gather before writing

1. `git --no-pager diff --stat <base>...<head>` (or against `HEAD` for
   uncommitted worktree changes) — scope of files touched.
2. `git --no-pager diff <base>...<head> -- <file>` for each non-trivial file —
   read the actual before/after.
3. Any companion plan/doc already in `Docs\refactor\` or `Docs\new-workflows\`
   that motivated the change — link to it, don't duplicate it.
4. Output of `code-smell-detection` and `common-pitfalls-checklist` skills if
   this summary accompanies a code review (see `review-doc-organizer` agent).

## Required Sections (in this order)

### 1. Problem Statement
One paragraph: what was broken, missing, or architecturally weak before this
change. Cite the specific symptom (e.g. "FabricDisplayBoot.cs was a single
2000+ line static class mixing transform math, JSON serialization, and
reflection-based kernel access").

### 2. Summary of Changes
Bullet list grouped by area (TS canvas / C# WASM host / test snapshots /
config), each bullet naming the file(s) and the one-line effect — not a
line-by-line diff restatement.

### 3. Design Approach
Name the pattern(s) actually applied — cross-reference the Ground Truth
tables in `design-pattern-refactoring` skill and cite real files (e.g.
"Template Method via `GivTransformPipeline`, wrapped by
`LoggingTransformOperationDecorator` → `ValidationTransformOperationDecorator`
→ `ExceptionMappingTransformOperationDecorator`, exposed through
`FabricKernelFacade`"). Explicitly state if a pattern from an earlier
`Docs\refactor\` plan was **not** used (e.g. "Command pattern was not
introduced; the plan's Command-based design was superseded by the Template
Method pipeline already in `GivTransformPipeline.cs`") rather than assuming
the plan was followed verbatim. If no pattern was applied (e.g. a data fix),
state that explicitly instead of forcing a pattern narrative.

### 4. Areas of Interest
Files/functions a reviewer should read first to understand the change,
ordered by how central they are to the diff (usually: new interfaces →
composition root → facade → decorators/strategies/commands → call-site
updates).

### 5. Critical Areas Requiring Careful Review
Call out anything touching:
- Decorator ordering (wrong order changes behavior — see
  `Decorators-explained.txt` and the real order documented in
  `FabricKernelFacade.cs`/`canvasCompositionRoot.ts`).
- Reflection into kernel-private members (`FabricDisplayBoot.Reflection.cs`)
  — confirm caching + logging are intact.
- Error-boundary placement (only one outermost catch-all per stack).
- Whether a change adds a **new** structural layer (new folder, new
  Command-style class, new monad helper) instead of reusing what's already
  documented in `design-pattern-refactoring` skill's Ground Truth tables —
  flag any invented parallel structure.
- Whether previously scaffolded-but-unwired code (TS Facade/Decorator/
  composition-root) got wired in as part of this change, and if so, confirm
  the concrete `IWasmBridge` implementation supplied is sound.
- Anything near `.spec.ts` test snapshots (`tests/snapshots/**`) — confirm
  these are incidental (e.g. rendering fix) and not weakening test rigor.
- Any change to `displayData.json`/`displaydata.json` — confirm it is test
  fixture data, not production persistence logic.

### 6. Assumptions Made
Explicit bullet list of anything inferred rather than confirmed — e.g.
"Assumed the existing Playwright snapshot diffs are an intended visual fix
tied to this refactor, not an unrelated regression" or "Assumed
`FabricDisplayBoot.cs`'s remaining ~150 lines after extraction are the
composition root wiring and JSExport entry points only."

### 7. Problem Being Solved / Addressed (recap for reviewers who skim)
One or two sentences restating the problem in light of the design approach —
"this closes the gap by ...".

### 8. Out of Scope / Not Addressed
Anything a reviewer might expect but was deliberately not touched (e.g. "the
legacy `GraphicsBuilder` WPF dialogs are unaffected; this PR only changes the
web/WASM canvas host").

---

## Style rules

- Use the same terse, high-signal tone as the existing `Docs\refactor\*.md`
  files in this repo — tables and bullet lists over prose paragraphs.
- Always cite concrete file paths and, where useful, line ranges — never say
  "some files were changed" without naming them.
- Do not restate the entire diff; summarize intent + risk.
- Keep total document length proportional to diff size — a 6-file diff should
  not produce a 2000-word document.
- Do not invent problems/assumptions not evidenced by the diff or commit
  history; if something is genuinely unclear, say so explicitly in
  "Assumptions Made" rather than guessing silently.

## Output location

Write the document via the `review-doc-organizer` agent's folder convention:
`Docs\reviews\<yyyy-MM-dd>-<short-topic-slug>\SUMMARY.md`. Do not scatter
review documents elsewhere in the repo.
