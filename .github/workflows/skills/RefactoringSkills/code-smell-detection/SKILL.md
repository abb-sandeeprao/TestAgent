---
name: code-smell-detection
description: >
  Scan GraphicsModelEditor TypeScript and C# code (FabricEditorCanvas.tsx,
  FabricDisplayBoot.cs and partials, canvas/ and FabricWasmHost/ folders) for
  code smells and map each smell to the specific design pattern that resolves
  it. Use after code has been generated or modified, when asked to "review this
  for code smells", "find refactor opportunities", or "check if this needs a
  pattern".
---

# Code Smell Detection Skill

Goal: find smells **and** name the exact pattern/fix — never report a smell
without a concrete next step. Use `design-pattern-refactoring` skill for the
implementation details of the suggested pattern.

## Smell Catalogue (repo-specific)

| # | Smell | How to detect it | Pattern / Fix |
|---|---|---|---|
| 1 | **Long conditional dispatch** | `if (msg?.type === 'x') { ... } if (msg?.type === 'y') { ... }` chains, or C# `switch` on a string growing past ~4 cases | Strategy — table lookup keyed by type/name (`canvas\events\strategies\`) |
| 2 | **God object / God method** | A component or static class doing DOM mounting + WASM wiring + event routing + serialization in one file/method (pre-refactor `FabricEditorCanvas.tsx`, `FabricDisplayBoot.cs`) | Facade to orchestrate, extract Services for each responsibility |
| 3 | **Duplicated multi-step sequence** | Same "reset → animate → capture → sync → serialize" (or equivalent) steps copy-pasted across Move/Resize/Rotate/Commit | Template Method (`GivTransformPipeline`) |
| 4 | **Cross-cutting concern inline** | `Console.WriteLine`/`console.debug` calls mixed into business logic; `try/catch` for logging purposes; manual `Stopwatch`/`performance.now()` timing inline | Decorator — extract to its own class implementing the same interface |
| 5 | **Repeated null/init guard** | `if (_commandHandler == null) return ErrJson(...)` duplicated 5+ times across methods | A single static guard helper with an `out` param (see `FabricWasmHost\Services\KernelContext.TryGetCommandHandler`) — only escalate to a full Validation Decorator if the guard needs to wrap an entire multi-method interface, not a single duplicated check |
| 6 | **Module-level mutable state** | `let _wasmInjected`, `let _hiddenSvgHost` at module scope in a `.tsx` file, mutated from multiple callbacks | Wrap in a small factory/class with explicit lifecycle (attach/detach), or `useRef` if state is component-scoped |
| 7 | **Silent exception swallowing** | `catch { }` with no logging and no rethrow | Either log-and-continue (`catch (Exception ex) { Console.WriteLine(...) }`) if genuinely non-fatal, or let it bubble to the outermost error-boundary decorator |
| 8 | **Ad hoc decorator/service construction** | `new SomeDecorator(new SomeService())` written inline inside a component, endpoint, or business method rather than in a composition root | Move construction to `canvasCompositionRoot.ts` / `FabricDisplayBoot.Composition.cs` |
| 9 | **Recursive setTimeout retry loop inline** | `const tryInit = (attempt=0) => { ...; if (attempt < N) setTimeout(() => tryInit(attempt+1), delay) }` written directly in a component | Extract to `RetryCanvasSyncDecorator` (or equivalent) with named `maxAttempts`/`delayMs` — same behavior, testable and reusable |
| 10 | **Reflection with no caching / no type-hierarchy walk** | `type.GetField("_x")` or `GetMethod(...)` called fresh on every invocation instead of cached per-`Type` | Cache in a `Dictionary<Type, FieldInfo/MethodInfo>` (see `_configItemFieldByType`, `_setRotationByType` in `FabricDisplayBoot.Reflection.cs` for the correct pattern) |
| 11 | **Reflection used where a public API would do** | Reflection reaching a field/method that has (or could have) a public accessor, used only to avoid a small interface change | Not a kernel constraint — add/extend a facade method or expose a legitimate seam instead. Only kernel-private members with no public accessor justify reflection. |
| 12 | **Mixed responsibilities in one function** | A function that projects data, formats strings, AND applies null-fallback logic all inline (e.g. old `BuildLayoutJson`) | Split into: pure projection → pure formatting → explicit fallback step, each independently testable |
| 13 | **Magic numbers/strings duplicated** | Retry counts, delay ms, JSON keys repeated as literals across files | Named constant near its single owning class (e.g. `RetryCanvasSyncDecorator.maxAttempts`) |
| 14 | **Leaky WASM/global access** | `(window as any).__fabricWasm` accessed directly and repeatedly across many call sites with no guard/fallback | Wrap behind `IWasmBridge` / facade with a single readiness check |
| 15 | **Invented parallel structure** | A new top-level folder/pattern layer added (e.g. `FabricWasmHost/Commands/`, a second `canvas/facade2/`) instead of reusing the existing convention documented in `design-pattern-refactoring` skill's Ground Truth tables | Reuse/extend the existing folder (`Services`, `Services/Decorators`, `Facade`, `core`, `services`, `decorators`, `events/strategies`, `composition`) — never add a competing structure for a concern this repo already resolved a different way |
| 16 | **Reimplemented monad/FP library** | A `Result`/`Option` type grows `flatMap`/`traverse`/applicative helpers, or an external FP package (fp-ts, ramda) is added | Keep it to the size of `canvas\utils\result.ts` / `utils\option.ts` — a tagged union plus a few named functions, nothing more |

## Procedure

1. Open the changed files (diff-scoped, not the whole repo) — use `git --no-pager diff` to scope the review.
2. For each file, scan top-to-bottom once for structural smells (#1–3, #6, #8, #9) before line-level smells (#4, #5, #7, #10–14).
3. For every smell found, output: **file:line**, the smell name from the table, a one-line justification quoting the offending code, and the specific pattern/fix (never generic advice like "refactor this").
4. Cross-check each reflection usage against #10/#11 specifically — this repo has legitimate, necessary reflection (`FabricDisplayBoot.Reflection.cs`) alongside potential misuse; do not flag legitimate kernel-private-member access as a smell, but do flag missing caching.
5. Group findings by severity: **Critical** (breaks encapsulation/error-boundary guarantees, e.g. #7, #8), **Moderate** (#1–3, #6, #9), **Minor** (#4, #5, #10, #12–14).
6. Hand off findings in this format so `review-doc-organizer` can consume them directly:

```markdown
### <file path>
| Line(s) | Smell | Evidence | Suggested Pattern/Fix | Severity |
|---|---|---|---|---|
| 402-408 | Recursive setTimeout retry inline | `const tryInit = (attempt=0) => {...}` | Extract `RetryCanvasSyncDecorator` | Moderate |
```

## Non-goals

- Do not flag intentional imperative code documented as required (see
  `Docs\refactor\fp-practices-declarative-style-overview.md` §2 "What to
  Preserve") — `static` WASM bridge fields, `[JSExport]` methods, kernel
  `AnimateTransformItem` mutation, `setTimeout` for paint-cycle deferral,
  `document.body.appendChild` are constraints, not smells.
- Do not flag the intentional structural asymmetries already in this repo as
  smells: no `TimingTransformOperationDecorator` on the C# side, the
  TS Facade/Decorator/Strategy-class scaffolding not yet wired into
  `FabricEditorCanvas.tsx`, or `KernelContext`'s static-helper (rather than
  decorator) guard style — these are documented, deliberate choices in
  `design-pattern-refactoring` skill's Ground Truth tables, not oversights.
- Do not suggest RxJS, monad libraries, or point-free style as a fix for any
  smell in this table — always resolve to Facade/Strategy/Template
  Method/Decorator/static-guard-helper per the `design-pattern-refactoring`
  skill, matching the exact structure already established in this repo.
