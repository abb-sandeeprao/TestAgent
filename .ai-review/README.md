# .ai-review — drop-in AI pull request review

Copy this folder into any repo, in any Azure DevOps org or on GitHub.
Nothing is downloaded at build time; the engine is the single file
`ai-pr-review.pyz`.

## Azure DevOps (3 steps)
1. Pipelines → New → Existing YAML → `/.ai-review/azure-pipelines.yml` → Save
2. Pipeline → Variables → add `GITHUB_TOKEN` (secret, PAT with *Copilot Requests*)
3. Repos → Branches → protected branch → Policies → Build validation → add the
   pipeline. **Required**, expire **immediately when branch is updated**.

Also grant the build service *Contribute to pull requests* on the repo, and
enable *Allow scripts to access the OAuth token* on the pipeline.

## GitHub (2 steps)
1. Copy `.github/workflows/ai-review.yml` into the repo (it ships alongside)
2. Settings → Secrets → `COPILOT_TOKEN`; Settings → Branches → require the check

## Override rules for this repo
Drop a `rules.json` in this folder. Same format as the bundled defaults.

## Optional local hook
    git config core.hooksPath .ai-review

## Updating
Replace `ai-pr-review.pyz` with the latest from the release page. One-file PR.
