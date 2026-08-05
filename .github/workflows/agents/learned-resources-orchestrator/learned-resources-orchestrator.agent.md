---
name: Resource Orchestrator
description: >
  Orchestrates the `resources/learned-resources` collection by scanning plain
  text resource files for simple status hints (e.g., `Status:` / `Progress:`
  lines, TODO/FIXME markers, or common "done" words) and updating the
  living document `resources/learned-resources/featureparity-and-highlevel-goals.md`
  by replacing the auto-generated progress block.
---

# Learned Resources Orchestrator (Agent)

## Purpose

Provide a reproducible, conservative automation that keeps a single living
progress snapshot for the repository's learned resources. When invoked the
agent should scan files, summarize detected status hints, and update the
living document's auto-generated progress block.

## Where the code lives

- Script: `.github/agents/learned-resources-orchestrator/index.js`
- Workflow: `.github/workflows/learned-resources-orchestrator.yml`
- Living document: `resources/learned-resources/featureparity-and-highlevel-goals.md`

## What to do (Behavior)

When triggered interactively or by automation, perform these steps:

1. Ensure `resources/learned-resources` exists. If missing, report and exit
   without writing (conservative fail-safe).
2. Scan all files in the folder (skip the living document itself).
3. For each file, detect status hints using heuristics:
   - Look for `Status:` or `Progress:` frontmatter-style lines (case-insensitive)
   - Detect `TODO`, `FIXME`, or `TO DO` markers
   - Detect words like `done`, `completed`, `finished` as likely finished
4. Build an auto-generated summary block enclosed between the markers
   `<!-- BEGIN AUTOGEN PROGRESS -->` and `<!-- END AUTOGEN PROGRESS -->` that
   contains a timestamp, summary counts, and a markdown table of discovered
   file statuses.
5. Replace the existing auto-generated block in the living document (or
   append it under the `## Current progress` heading if markers are missing).
6. Write the updated living document and report `UPDATED: <path>` or
   `NO_CHANGES: <path>` on stdout.

## How to run

- Locally: `node .github/agents/learned-resources-orchestrator/index.js`
- CI: workflow triggers on pushes to `resources/learned-resources/**` or via
  manual `workflow_dispatch`. The workflow commits changes if git status shows
  modifications.

## Extensibility

- Improve detection heuristics (YAML frontmatter parsing, richer status
  tokens, or per-file metadata).
- Emit a machine-readable summary (JSON) for downstream automation or PR
  templates.
- Add tests for parsing heuristics and the replacement logic.

## Output format (for automated callers)

- Console output lines: `UPDATED: <livingDocPath>` or `NO_CHANGES: <livingDocPath>`
- Writes `resources/learned-resources/featureparity-and-highlevel-goals.md`.

## Notes & Safety

- The orchestrator is intentionally conservative: it never writes if the
  resources folder is missing and preserves all content outside the
  auto-generated block.
- Keep human notes and critiques outside the auto-generated block to avoid
  accidental overwrites.

## Assumptions

1. Resource files are plain text (Markdown or .txt) and live under
   `resources/learned-resources`.
2. Status hints appear as `Status:` / `Progress:` lines or via TODO/FIXME
   markers; these heuristics are intentionally simple.
3. The living document resides at `resources/learned-resources/featureparity-and-highlevel-goals.md`.
4. The CI workflow is responsible for committing changes produced by the
   orchestrator when run in GitHub Actions.
