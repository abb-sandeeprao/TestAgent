# Copilot Workspace Instructions

Purpose: Minimal, workspace-wide guidance for agents and contributors working on the Graphics Editor web port.

## Always end with assumptions
- At the end of every task/response involving code changes, bug fixes, or test additions, always provide an explicit, itemized list of all assumptions made during the work (e.g., about intended behavior, scope boundaries, environment specifics, or ambiguous requirements that were resolved without asking).
- This applies even when the task appears fully successful — assumptions must be surfaced so a human reviewer can validate or correct them.
- If no assumptions were made, state that explicitly rather than omitting the section.

## Quickstart (short)
- Prereqs: .NET 8 SDK with WASM workload, Python 3 (for serving AppBundle), PowerShell for `Build.ps1`.
- Build local packages: `./build-local-package.sh` (creates `nupkgs/`).
- Build solution: `dotnet build NetStd-webAvaloniaKernel.sln` (from repo root).
- Build & serve the WASM editor AppBundle:

```
dotnet build GraphicsEditor.app\\GraphicEditor.App.csproj -f net8.0-browser -r browser-wasm
cd GraphicsEditor.app\\bin\\Debug\\net8.0-browser\\browser-wasm\\AppBundle
python -m http.server 8080
```

- Build Avalonia browser host: `dotnet build AvaloniaWeb.Browser\\AvaloniaWeb.Browser.csproj`.

## Reuse the Graphics Kernel (CRITICAL)
- Do NOT modify the Graphics Kernel source when porting to the web. Reuse the kernel assemblies and code as-is.
- Kernel locations to reference (do not edit):
  - `NetStandard/GraphicsKernel/GraphicsKernel.csproj`
  - `Source/Kernel/GraphicsKernel` (source tree / unit tests)

When in doubt, ask: if a change touches core kernel behavior, avoid it — prefer adapters or platform-specific shims in the web host.

## Data files (display + element data)
- Primary source for sample payloads: `Source/Graphics.Client.Interface/displaydata.json`.
- If you need element metadata, add `elementdata.json` next to `displaydata.json` (`Source/Graphics.Client.Interface/elementdata.json`) and ensure the web host either embeds the file as an `EmbeddedResource` in `AvaloniaWeb` or serves it from the AppBundle.
- IMPORTANT: Do NOT use browser localStorage or other client-side storage to persist display or element data. Always persist display data to the server-side storage or an approved, secure persistence mechanism. Client-side storage is volatile, insecure, and may cause inconsistent application state across environments.

## Important links (quick)
- README: [README.md](README.md)
- Root Copilot notes: [copilot_instructions.md](copilot_instructions.md)
- Important: the root folder of the Graphics Editor solution is located at \packages\GraphicsModelEditor
- Build scripts: [Build.ps1](Build.ps1), [build-local-package.sh](build-local-package.sh)
- WASM editor project: [GraphicsEditor.app/GraphicEditor.App.csproj](GraphicsEditor.app/GraphicEditor.App.csproj)
- Avalonia browser host: [AvaloniaWeb.Browser/AvaloniaWeb.Browser.csproj](AvaloniaWeb.Browser/AvaloniaWeb.Browser.csproj)
- Engine & kernel: [GraphicsEngine/GraphicsEngine.csproj](GraphicsEngine/GraphicsEngine.csproj), [NetStandard/GraphicsKernel/GraphicsKernel.csproj](NetStandard/GraphicsKernel/GraphicsKernel.csproj)
- Display data: [Source/Graphics.Client.Interface/displaydata.json](Source/Graphics.Client.Interface/displaydata.json)
- Local packages: `nupkgs/`

## Git Worktree Setup
This repository uses **git worktrees** rooted at `C:\FabricDev_WS`:

| Path | Branch | Purpose |
|------|--------|---------|
| `C:\FabricDev_WS\PCP.Operations.HMI.Engineering.Graphics` | `main` | Primary worktree (bare/main branch) |
| `C:\FabricDev_WS\resize-support` | `FabricJS_GraphicsEditor` | Feature worktree for Graphics Editor FabricJS port |

- The **Graphics Editor solution** (`packages\GraphicsModelEditor`) lives in the `resize-support` worktree (`FabricJS_GraphicsEditor` branch).
- When running git commands, always `cd` into the correct worktree first (e.g., `cd C:\FabricDev_WS\resize-support`).
- Feature implementations based on the Graphics Kernel and legacy application flow are developed in the `resize-support` worktree and guided by the **Builder Agent**.
- To add a new worktree for a different feature branch: `git worktree add C:\FabricDev_WS\<branch-name> <branch>` (run from any existing worktree).
- List all worktrees: `git --no-pager worktree list` (from any worktree directory).

## Incremental Stand-In Data Loader Migration

This repository is assembled across incremental worktrees under `PR-seggregation`. The complete reference implementation is in the sibling `feats-refactor` worktree:

- Reference root: `C:\FabricDev_WS\PR-seggregation\feats-refactor`
- Current slice: `C:\FabricDev_WS\PR-seggregation\02-StandInDataLoaderAdapter`
- Reference project root: `feats-refactor\packages\GraphicsModelEditor`
- Current project root: `02-StandInDataLoaderAdapter\packages\GraphicsModelEditor`

When working on this slice:

1. Treat `feats-refactor` as the source of truth for public contracts, startup order, kernel bootstrap, SVG rendering, and Save/update behavior.
2. Keep `packages\GraphicsModelEditor\FabricWasmHost` frozen. Do not edit, refactor, or add mock classes under `FabricWasmHost`; satisfy its existing project references with stubs and adapters in dependency projects.
3. Keep the Graphics Kernel, client interface, access layers, platform layers, and contract projects as stand-in implementations. Preserve the public type and method names used by `feats-refactor`, but return deterministic dummy data through callbacks/services.
4. Route dummy display data through the reference flow: data loader → graphics access → system/runtime services → kernel bootstrap → existing `SvgDrawingAdapter` → WASM bridge → React/FabricJS.
5. The mock kernel must render at least one SVG-compatible graphic item and emit a diagnostic log when Save or a committed mutation reaches the kernel update path. Do not bypass the kernel by injecting SVG directly into React.
6. Validate with Chrome DevTools: record console messages, inspect failed network requests, capture a screenshot showing the mock graphic item, and exercise Save to confirm the mocked kernel update log.
7. Keep changes outside `FabricWasmHost` surgical and incremental. Do not copy the full kernel or unrelated source tree from `feats-refactor`; add only the smallest compatible stubs needed for this branch.

## Repository conventions
- Windows paths: prefer backslashes (`C:\path\to\file`) in commands and file paths when running on Windows hosts.
- Commit message trailer (when creating commits locally): `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`
- When uncertain about scope or behavior, Copilot will ask one clarifying question using the `ask_user` tool.

## APUX Package Rule

- Use only `@abb-hmi/apux` and `@abb-hmi/apux-jsx` for APUX components and JSX wrappers when building screens or UI.
- Do not register custom APUX elements (avoid `customElements.define(...)`) or add undocumented/custom attributes to APUX components.
- Do not modify `packages/` source code to change APUX behavior; rely on the official package exports.

Runtime import guidance:

- Prefer using the registered web components `<apux-*>` directly in JSX at runtime.
- Avoid importing React wrapper modules from `@abb-hmi/apux` or `@abb-hmi/apux-jsx` at runtime unless a wrapper provides essential runtime behavior not available via the web component.
- When you only need DOM typing (for `ref` queries or event targets), use a type-only import to avoid pulling runtime code into bundles, for example:

```ts
import type { ApuxButton } from '@abb-hmi/apux'
```

This import line is an example — replace `ApuxButton` with the actual type you need. This keeps the bundle free of unintended runtime wrapper side-effects while allowing typed element access.

## Architecture & Design Documentation (REQUIRED READING)

**Before generating code or making architectural changes, read these documents in order:**

### 1. Intended Architecture Documents
All future code generation MUST adhere to these foundational documents:

- **`/packages/GraphicsModelEditor/Docs/INTENDED-FUNCTIONALITY.md`** — What the system does from user perspective
  - User workflows and use cases
  - Feature matrix (current, in-progress, planned)
  - Constraints and limitations
  - Success criteria for each workflow
  - **Read this first** to understand requirements

- **`/packages/GraphicsModelEditor/Docs/INTENDED-DESIGN.md`** — The target architectural design
  - Architectural layers (UI → Services → Kernel)
  - Core patterns and principles
  - Redux store structure and state shape
  - Command pattern integration
  - WASM kernel boundary crossing rules
  - Data flow architecture
  - **Read this before designing new features**

- **`/packages/GraphicsModelEditor/Docs/INTENDED-FLOWS.md`** — All major system flows
  - Application startup and display loading
  - GIV rendering and selection
  - Property editing and kernel sync
  - Undo/redo command flow
  - Tool operations (move, resize, rotate)
  - Save/reload workflow
  - **Reference this when implementing flows**

### 2. Design Documentation (for code generation context)
When generating code for specific flows:

- **`/packages/GraphicsModelEditor/Docs/design/01-08`** — Detailed flow documentation
  - Each file documents one end-to-end flow
  - Includes code locations, patterns, and conformance checklists
  - Read the relevant document before implementing

- **`/packages/GraphicsModelEditor/Docs/design/README.md`** — Quick reference guide
  - Table linking flows to documents
  - Architectural patterns with code examples
  - Common pitfalls to avoid

### 3. Refactoring Plans (for architectural changes)
When refactoring or introducing new patterns:

- **`/packages/GraphicsModelEditor/Docs/refactor/redux-command-pattern-refactoring-plan.md`** — Redux + Command pattern migration
  - 6-phase refactoring plan with file-by-file changes
  - State shape and reducer design
  - Command pattern implementation
  - Undo/redo refactoring strategy
  - Testing and validation approach
  - Effort estimates and risk mitigation

### How to Use These Documents in Code Generation

**For new features:**
1. Check INTENDED-FUNCTIONALITY.md for requirements
2. Read INTENDED-FLOWS.md for related flows
3. Read relevant design doc (01-08) for patterns
4. Follow patterns documented in INTENDED-DESIGN.md
5. Reference in PR/commit: "Aligns with <doc name>"

**For code changes:**
1. Read INTENDED-DESIGN.md to understand target architecture
2. Check if your change is covered by redux-command-pattern-refactoring-plan.md
3. Verify conformance against design doc's checklist
4. Add code comment referencing design decision if non-obvious

**For architectural changes:**
1. Update INTENDED-DESIGN.md with new architecture
2. Update relevant design docs (01-08) if flows change
3. Create new refactoring plan for transition
4. Document rationale and trade-offs

## State Management Architecture (Three-Tier Transition Path)

**Status:** Architecture documented in `/packages/GraphicsModelEditor/Docs/design/INTENDED-DESIGN.md` §3; refactoring plan with detailed phases in `/packages/GraphicsModelEditor/Docs/refactor/redux-command-pattern-refactoring-plan.md`

The Graphics Model Editor is transitioning through three architectural stages for state management:

### Tier 1: useReducer (Phase 0 — Intermediate Step)
**Current Target:** Consolidate scattered `useState` hooks into a single unified state object managed by React's `useReducer` hook.

**Benefits:**
- ✅ Single state object (no prop-drilling)
- ✅ Pure reducer function (independently testable)
- ✅ No external dependencies
- ✅ Natural bridge to Redux (mechanical migration)

**Key Files (Phase 0):**
```
src/state/
├── appState.ts         (unified AppState interface)
├── appReducer.ts       (pure reducer + AppAction types)
├── appSelectors.ts     (selector functions for derived data)
└── AppContext.tsx      (AppContext.Provider for state access)
```

**Usage Pattern:**
```typescript
// Create unified state
const [appState, dispatch] = useReducer(appReducer, initialAppState)

// Dispatch actions instead of setState
dispatch({ type: 'SELECTION_CHANGED', payload: { indices: [1, 2] } })

// Access state via context to avoid prop-drilling
const { state, dispatch } = useAppState()
```

### Tier 2: Redux (Phase 1 — Full State Management)
**Next Target:** Upgrade from `useReducer` to Redux Toolkit for:
- Middleware support (kernel sync, logging, error handling)
- DevTools integration (time-travel debugging)
- Better tooling and ecosystem

**Key Differences:**
- Redux store replaces `useReducer` (mechanical change)
- Middleware handles WASM kernel synchronization
- `useSelector` + `useDispatch` replace `useAppState` context
- Same action types and reducer logic (mostly copied)

### Tier 3: Command Pattern (Phase 2+)
**Final Target:** Formalize every user action as a first-class Command object:
- Validates preconditions
- Executes in WASM kernel
- Syncs response to Redux store
- Records in undo/redo history

**Command Lifecycle:**
```typescript
const command = new MoveCommand(givIndex, newX, newY)
const canExecute = command.canExecute(appState)  // Validate
if (canExecute) {
  const result = await command.execute(kernel)    // Kernel call
  dispatch(command.successAction(result))         // Sync to Redux
  historyStack.push(command)                       // Undo/redo
}
```

### Key State Structure (Unified across all tiers)
```
AppState = {
  display:     { name, genericElements, isLoading, error }
  selection:   { indices[], mode }
  canvas:      { zoom, pan, selectedTool, dragState, contextMenu }
  properties:  { descriptors, selectedItemIndex }
  undo_redo:   { undoCount, redoCount, isEnabled flags }
  ui:          { status, displays, dialogs, treeNodes, contextMenu }
}
```

### Progression Path
```
Current (scattered useState)
  ↓
Phase 0: useReducer (consolidated, testable, no deps)
  ↓
Phase 1: Redux (middleware, DevTools, ecosystem)
  ↓
Phase 2: Command Pattern (formal actions, validation, undo/redo)
```

**You can stop at any tier** and maintain full functionality (each is backward compatible with WASM).

### No Direct State Mutations
Regardless of tier:
- ❌ Do NOT mutate React state directly (`setState` or reducer state)
- ❌ Do NOT call kernel APIs without dispatching action
- ❌ Do NOT update canvas without state dispatch
- ✅ Always dispatch actions or dispatch commands for consistency

## Build & PR checklist
- Run `dotnet test` for kernel and related unit tests.
- Build the WASM editor and serve the AppBundle locally to validate visuals.
- Ensure `displaydata.json` and `elementdata.json` used for visual verification are included in the AppBundle or embedded resources.
- Do not change kernel behavior; if a bug appears in rendered visuals, reproduce with the viewer and note differences.
- Verify code change references relevant design document (INTENDED-DESIGN.md §3 for state management, INTENDED-FLOWS.md, or design/01-08)
- If Phase 0+ complete: Ensure all state mutations use `dispatch` (no direct state changes)
- If Phase 1+ complete: Redux actions dispatch Commands for all mutations (check Redux DevTools)
- Check that undo/redo still works correctly

## Example agent prompts (useful for quick tasks)

## Example agent prompts (useful for quick tasks)
- "Build the Avalonia WebAssembly editor and serve the AppBundle locally; list the exact commands and prerequisites."
- "Run unit tests for the graphics kernel projects and return failing tests with stack traces."
- "Execute Tools/GraphicsWorkerHostInvoker against Source/Graphics.Client.Interface/displaydata.json and report whether the display loads successfully."
- "Review this code change against the INTENDED-DESIGN.md and /packages/GraphicsModelEditor/Docs/design/02-GIV-SELECTION-FLOW.md for conformance."
- "Implement this feature following the redux-command-pattern-refactoring-plan.md Phase 2 Command pattern guidelines."
  
## Code Review
Perform the code review by running the below one after the other.
- Use the review\dotnet-design-pattern-review skill for reviewing c# and provide a review checklist report
- Use the review\web-design-reviewer skill for revieweing web application code.
- Use review.md for generic style checks.