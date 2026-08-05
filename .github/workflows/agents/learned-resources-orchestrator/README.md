Learned Resources Orchestrator

What it is
- A lightweight orchestrator (Node.js script) that scans resources/learned-resources and updates a living document (featureparity-and-highlevel-goals.md).

Where it lives
- Script: .github/agents/learned-resources-orchestrator/index.js
- Workflow: .github/workflows/learned-resources-orchestrator.yml
- Living doc: resources/learned-resources/featureparity-and-highlevel-goals.md

How it works
- The script looks for simple signals inside resource files: `Status:` or `Progress:` lines, TODO/FIXME, or common "done" words.
- It replaces the auto-generated progress block between <!-- BEGIN AUTOGEN PROGRESS --> and <!-- END AUTOGEN PROGRESS --> so human notes elsewhere are preserved.

How to run
- Locally: node .github/agents/learned-resources-orchestrator/index.js
- GitHub Actions: triggered on push to resources/learned-resources/** or via manual workflow_dispatch.

Committing changes
- The workflow commits updates to the living document automatically when run in CI. Locally, commit changes as usual.

Extending or customizing
- Improve detection heuristics in index.js.
- Add tests or richer parsing (YAML frontmatter, task extraction).

Notes
- The orchestrator is intentionally conservative: if resources/learned-resources is missing it exits without writing.
- Keep manual notes and critiques outside the auto-generated block to avoid overwrites.

Assumptions made by the agent
1. Resource files are plain text (markdown, txt) and live in resources/learned-resources.
2. Status hints appear as `Status:` or `Progress:` lines, or via TODO/FIXME mentions.
3. The living document belongs under resources/learned-resources so it's colocated with the sources it tracks.
