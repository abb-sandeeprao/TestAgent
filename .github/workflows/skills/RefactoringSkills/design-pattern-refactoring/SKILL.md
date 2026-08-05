---
name: design-pattern-refactoring
description: >
  Refactor GraphicsModelEditor TypeScript (graphicseditor.shell.web/src/canvas) and
  C# WASM host (FabricWasmHost) code toward a declarative, pattern-based style
  (Facade, Strategy, Template Method, Decorator) without RxJS or advanced FP
  idioms — following the EXACT structure and conventions already established by
  the in-progress refactor in this worktree. Use when asked to refactor
  FabricEditorCanvas.tsx, FabricDisplayBoot.cs and partials, add a design
  pattern, extract a service/decorator, or "make this code more declarative /
  simpler / maintainable".
---

# Design-Pattern Refactoring Skill

This skill is grounded in the **actual, verified code already present in this
worktree** (not just the original planning docs in `Docs\refactor\`). Those
plan docs describe the *intent*; this skill describes what was *actually
built*, including places where the real implementation intentionally
diverged from or simplified the plan. Always prefer what's on disk over what
the plan docs say — the plan docs are historical design notes, not a spec to
re-derive from scratch.

## Philosophy — declarative-by-composition, not declarative-by-FP

Declarative style here comes from **naming intent through small
objects/functions and composing them** — not from RxJS observables, external
FP libraries, `pipe()`/`flow()` combinator utilities, or point-free style. An
ordinary C#/TypeScript developer must be able to read any file top-to-bottom
without knowing functional-programming jargon.

- ✅ `new ExceptionMappingTransformOperationDecorator(new ValidationTransformOperationDecorator(...))`
- ❌ `pipe(WasmBridge, withLogging, withTiming)` (combinator library)
- ✅ `layout.givs.filter(g => g.hash != null).map(g => [g.hash, g.index])` (plain `Array.prototype`)
- ✅ A **small, local, dependency-free tagged union** for Result/Option — see
  `canvas\utils\result.ts` (5 lines: `ok`/`err`/`mapResult`) and
  `canvas\utils\option.ts` (10 lines: `some`/`none`/`fromNullable`/`chain`/`getOrElse`).
  This repo already uses these two files — they are the calibration point for
  "how much FP is acceptable": a plain discriminated union plus a couple of
  named helper functions, nothing more.
- ❌ Pulling in an external FP library (fp-ts, ramda, remeda, etc.) or building
  a general-purpose combinator/monad-transformer framework.
- ❌ RxJS, `Observable`, `Subject`, or reactive operator chains anywhere in
  this package.

---

## Ground Truth: Verified Current Structure

Read this section before creating any new file. It reflects what exists on
disk right now, including what is **live/wired** vs. **scaffolded but not
yet wired into the running code path**. Extend this structure — don't
invent a parallel one.

### TypeScript (`graphicseditor.shell.web/src/canvas/`)

| File | Status | Role |
|---|---|---|
| `core/IWasmBridge.ts` | Live (contract) | Interface implemented by every decorator |
| `services/bootstrapState.ts` | **Live**, imported by `FabricEditorCanvas.tsx` | Replaces module-level `let _wasmInjected` / `let _hiddenSvgHost` with an immutable-state-object + getter/setter functions (`getBootstrapState`, `markWasmInjected`, `setHiddenSvgHost`) — not a class, not React state |
| `utils/result.ts` | Live | Local `Result<T,E>` tagged union: `ok`, `err`, `mapResult` |
| `utils/option.ts` | Live | Local `Option<T>` tagged union: `some`, `none`, `fromNullable`, `chain`, `getOrElse` |
| `utils/svgParser.ts` | **Live**, imported by `FabricEditorCanvas.tsx` | Pure function `parseSvgString(svg): Result<SVGSVGElement, string>` |
| `events/wasmEventHandlers.ts` | **Live**, imported by `FabricEditorCanvas.tsx` | The actual Strategy dispatch: `wasmEventHandlers: Record<string, WasmEventHandler>` plus the handler functions (`handleTreeUpdated`, `handleGivCreated`, `handleGivUpdated`) extracted **verbatim** from the old if-chain. `FabricEditorCanvas.tsx` calls `wasmEventHandlers[msg.type]?.(msg, wasmCtx)` directly. |
| `events/strategies/TreeUpdatedStrategy.ts`, `GivCreatedStrategy.ts` | **Scaffolded, not yet wired** | Thin classes that delegate to the corresponding `handleX` function in `wasmEventHandlers.ts` — they exist as an OO-style Strategy facade over the dispatch table but the component does not call them yet |
| `events/strategies/PointListModeStrategy.ts` | **Scaffolded, not yet wired** | The one strategy that holds real logic directly (point-list draw-mode start/end lifecycle) rather than delegating — it was never part of the old if-chain in `wasmEventHandlers.ts` |
| `decorators/LoggingWasmBridgeDecorator.ts`, `TimingWasmBridgeDecorator.ts`, `ErrorHandlingWasmBridgeDecorator.ts` | **Scaffolded, not yet wired** | All implement `IWasmBridge`, wrap `inner: IWasmBridge`, async/`Promise`-returning methods |
| `facade/CanvasRuntimeFacade.ts` | **Scaffolded, not yet wired** | Static `create()` factory, private constructor, flat `Promise<string>` operations delegating to an `IWasmBridge` |
| `composition/canvasCompositionRoot.ts` | **Scaffolded, not yet wired** | `composeWasmBridge(core)` wires `ErrorHandling(Timing(Logging(core)))`; `createCanvasRuntime(core)` builds the facade over it. Takes a caller-supplied `core: IWasmBridge` — **no concrete `IWasmBridge` implementation exists yet in this repo**. |

**Action when picking up more canvas refactor work:** the Facade/Decorator/
Composition-root/Strategy-class scaffolding already exists and compiles. Wire
it into `FabricEditorCanvas.tsx` (supply the concrete `IWasmBridge`
implementation and switch the component to call through
`canvasCompositionRoot`/`CanvasRuntimeFacade`) rather than building a second,
competing abstraction. If wiring it in is out of scope for the current task,
say so explicitly instead of silently leaving two parallel designs.

### C# (`FabricWasmHost/`)

| File | Status | Role |
|---|---|---|
| `FabricDisplayBoot.cs` | Live | Shared static fields only (`_viewer`, `_capturedGivs`, `_commandHandler`, `_adapter`, ...) plus remaining non-decorated JSExport areas |
| `FabricDisplayBoot.{Transforms,References,InputProperties,PointList,CreateGiv,Commit,Init,Serialization,Reflection}.cs` | Live | Pre-existing partial-class-per-area convention, preserved |
| `FabricDisplayBoot.Transforms.cs` | Live | Holds the real transform logic as `*Impl` static methods (`MoveGivImpl`, `ResizeGivImpl`, `RotateGivImpl`, `RotateGivAroundPointImpl`, `CommitMoveGivImpl`, ...). Comment at top: "`[JSExport] entry points live in FabricDisplayBoot.Composition.cs and delegate...`" |
| `FabricDisplayBoot.Composition.cs` | **Live** — this is the actual composition root | Holds **only** the `[JSExport]` entry points for the 8 transform operations; each is a one-line delegation: `FabricKernelFacade.TransformService.MoveGiv(...)` |
| `Services/Contracts/ITransformOperationService.cs` | Live | Contract implemented by the core service and every decorator |
| `Services/TransformOperationService.cs` | Live | Thin delegation wrapper: each method calls the matching `FabricDisplayBoot.XxxImpl(...)` — the real logic stays in `FabricDisplayBoot.Transforms.cs` |
| `Services/KernelContext.cs` | Live | **Not a decorator** — a plain internal static helper (`TryGetCommandHandler(out handler, out errJson)`) that centralizes the `_commandHandler == null` guard previously duplicated inline. This is the accepted lightweight alternative to a decorator for a single repeated guard. |
| `Services/GivTransformPipeline.cs` | Live | The Template Method: `ExecutePreview`/`ExecuteCommit` → private `ExecuteCore(givIndex, buildMatrix, commit)` running validate → execute → refresh adapter → sync bounds → serialize. Deliberately has **no try/catch** — exceptions bubble to the decorator error boundary. |
| `Services/Decorators/LoggingTransformOperationDecorator.cs`, `ValidationTransformOperationDecorator.cs`, `ExceptionMappingTransformOperationDecorator.cs` | Live — **only these three** | No `TimingTransformOperationDecorator` exists on the C# side; the original plan's 4-layer stack was simplified to 3 during implementation. Do not add a Timing decorator here unless explicitly asked — match what's real. |
| `Facade/FabricKernelFacade.cs` | Live | Static class, single lazily-built instance via `??=`. XML doc states the real, current order: **`ExceptionMapping → Validation → Logging → Core`** (outermost first). |

**No `FabricWasmHost/Commands/` folder exists and none should be added.** The
plan doc mentions a Command pattern (`MoveGivCommand`, `ResizeGivCommand`,
etc.); the actual implementation resolved the "duplicated multi-step
sequence" problem with the **Template Method** (`GivTransformPipeline`)
instead, wrapped by the Facade+Decorator stack. Do not introduce Command
classes for transform operations — extend `GivTransformPipeline` or add a
sibling template method following the same shape.

---

## Pattern Map (grounded in what's actually implemented)

| Symptom | Pattern used in this repo | Where |
|---|---|---|
| Long `if (msg.type === 'x') ... else if` chain | **Strategy via lookup table** (`Record<string, Handler>`), not per-case classes | `canvas\events\wasmEventHandlers.ts` |
| Same 5-step sequence repeated per transform op | **Template Method** | `FabricWasmHost\Services\GivTransformPipeline.cs` |
| Cross-cutting concern (log/validate/map-exceptions) on kernel transform ops | **Decorator**, wired once in a Facade | `FabricWasmHost\Services\Decorators\*.cs` + `Facade\FabricKernelFacade.cs` |
| Cross-cutting concern on the WASM message bridge (TS) | **Decorator**, wired once in a composition root (scaffolded, not yet live) | `canvas\decorators\*.ts` + `canvas\composition\canvasCompositionRoot.ts` |
| One repeated null/init guard across many methods | **Static guard helper** (out-param), not necessarily a decorator | `FabricWasmHost\Services\KernelContext.cs` |
| Module-level mutable `let` state in a component file | **Immutable-state-object module** with getter/setter functions | `canvas\services\bootstrapState.ts` |
| Null-check explosion / parse-failure handling | **Small local tagged union** (`Result<T,E>`, `Option<T>`), not a monad library | `canvas\utils\result.ts`, `canvas\utils\option.ts` |
| Stable, small entry-point API hiding decorator composition | **Facade** | `FabricWasmHost\Facade\FabricKernelFacade.cs`, `canvas\facade\CanvasRuntimeFacade.ts` (TS one scaffolded) |

---

## DO

### 1. Match the naming convention: `Impl` methods + thin service wrapper (C#)
Real business logic stays where it already lives (`FabricDisplayBoot.Transforms.cs`
as `*Impl` methods); the `Services/TransformOperationService.cs` is a **thin
pass-through**, not a reimplementation:
```csharp
public string MoveGiv(int givIndex, double dx, double dy) =>
    FabricDisplayBoot.MoveGivImpl(givIndex, dx, dy);
```
When adding a new decorated operation, follow the same shape: put the real
logic in the relevant `FabricDisplayBoot.{Area}.cs` partial as an `XxxImpl`
method, then add a one-line pass-through in the matching `Services\*.cs`
service class.

### 2. Wire decorators in exactly one place, matching the real documented order
```csharp
// FabricKernelFacade.cs — outermost first, exactly as implemented today:
new ExceptionMappingTransformOperationDecorator(
    new ValidationTransformOperationDecorator(
        new LoggingTransformOperationDecorator(
            new TransformOperationService())));
```
```ts
// canvasCompositionRoot.ts — outermost first, exactly as implemented today:
new ErrorHandlingWasmBridgeDecorator(
  new TimingWasmBridgeDecorator(
    new LoggingWasmBridgeDecorator(core)))
```
Note the asymmetry: C# has no Timing layer, TS does. Don't "fix" this
asymmetry by adding a matching layer on the other side unless asked — it
reflects a real, deliberate implementation decision, not an oversight to
correct.

### 3. Extend the Strategy dispatch table, don't grow a conditional
```ts
export const wasmEventHandlers: Record<string, WasmEventHandler> = {
  treeUpdated: handleTreeUpdated,
  givCreated:  handleGivCreated,
  givUpdated:  handleGivUpdated,
  // new message type → add one entry + one named handler function above
}
```
If you also want an OO-style Strategy class for a new message type (matching
`TreeUpdatedStrategy`/`GivCreatedStrategy`), make it **delegate** to the
handler function in `wasmEventHandlers.ts` — never duplicate the logic in
both places:
```ts
export class NewMessageStrategy {
  handle(msg: any, ctx: WasmEventContext): void {
    handleNewMessage(msg, ctx)   // delegate, don't reimplement
  }
}
```
`PointListModeStrategy` is the one legitimate exception — it holds real logic
because it was never part of the original if-chain in `onWasm`/`wasmEventHandlers.ts`.

### 4. Use a small local tagged union for Result/Option — this is the calibrated bar
```ts
export type Result<T, E> = { tag: 'ok'; value: T } | { tag: 'err'; error: E }
export const ok  = <T>(v: T): Result<T, never> => ({ tag: 'ok', value: v })
export const err = <E>(e: E): Result<never, E> => ({ tag: 'err', error: e })
```
This is the exact shape already in `utils/result.ts` — five lines, no
external dependency, no generalized monad transformer. Match this size and
shape if you need a similar type; do not expand it into a full functional
library (no `flatMap`/`traverse`/`sequence`/applicative helpers).

### 5. Replace one repeated guard with a static helper before reaching for a decorator
```csharp
// KernelContext.cs — a plain static helper is enough for a single guard
// duplicated across many JSExport methods; it does not need a decorator
// or an interface if it is only ever called synchronously as a guard clause.
internal static bool TryGetCommandHandler(out CommandHandler handler, out string errJson) { ... }
```
Reserve full Decorator classes for concerns that need to wrap an entire
interface's worth of methods (logging, validation, timing, exception
mapping over a multi-method service) — not for a single duplicated
one-line guard.

### 6. Use plain `Array`/LINQ methods for data shaping
```ts
const hashToIndex: ReadonlyMap<string, number> = new Map(
  layout.givs
    .filter((g): g is GivInfo & { hash: number; index: number } => g.hash != null && g.index != null)
    .map(g => [String(g.hash), g.index])
)
```
This is already the pattern used for `buildHashToIndexMap` in
`FabricEditorCanvas.tsx` — plain `.filter().map()`, no library needed.

### 7. Replace module-level mutable `let`s with an immutable-state-object module
```ts
// bootstrapState.ts
type BootstrapState = { readonly wasmInjected: boolean; readonly hiddenSvgHost: HTMLDivElement | null }
let _state: BootstrapState = { wasmInjected: false, hiddenSvgHost: null }
export const getBootstrapState = () => _state
export const markWasmInjected  = () => { _state = { ..._state, wasmInjected: true } }
```
One private mutable reference, replaced wholesale (`{ ..._state, x }`) rather
than mutated in place; all reads/writes go through named exported functions.
This is the pattern to reuse for any other module-level mutable state found
during a refactor — not a class, not a React hook, unless the state is
genuinely component-scoped.

### 8. Keep necessary imperative code, isolate it, and don't touch the kernel
`setTimeout`-based retry, `[JSExport]` static entry points, `static` WASM
bridge fields, and kernel `AnimateTransformItem` mutation are legitimate —
wrap them, don't eliminate them. Never modify Graphics Kernel source
(`NetStandard/GraphicsKernel`, `Source/Kernel/GraphicsKernel`).

### 9. One error boundary per stack, at the outermost layer
`ExceptionMappingTransformOperationDecorator` (C#) and
`ErrorHandlingWasmBridgeDecorator` (TS) are the only classes allowed to catch
broadly. `GivTransformPipeline.ExecuteCore` explicitly has no try/catch —
follow that precedent for any new template method.

---

## DON'T

- ❌ Don't introduce RxJS, `Observable`, `Subject`, or reactive operator chains.
- ❌ Don't add an external FP library (fp-ts, ramda, remeda) or build a general-purpose monad/combinator framework. A `Result`/`Option` type is fine **only** if it stays as small as `utils/result.ts`/`utils/option.ts` (a handful of named functions, no `pipe`/`traverse`/typeclass machinery).
- ❌ Don't add a `FabricWasmHost/Commands/` folder or `MoveGivCommand`-style classes — this repo resolved that concern with `GivTransformPipeline` (Template Method) instead. Extend the pipeline; don't introduce a parallel Command layer.
- ❌ Don't add a `TimingTransformOperationDecorator` (C#) to "match" the TS side, or remove `TimingWasmBridgeDecorator` (TS) to "match" the C# side — the asymmetry is intentional; don't silently rebalance it.
- ❌ Don't duplicate a `wasmEventHandlers.ts` handler's logic inside its corresponding `events/strategies/*.ts` class — the strategy class must delegate, matching `TreeUpdatedStrategy`/`GivCreatedStrategy`.
- ❌ Don't build a second, competing Facade/composition-root/decorator stack for the TS canvas bridge because the existing one (`canvasCompositionRoot.ts`, `CanvasRuntimeFacade.ts`) isn't wired into `FabricEditorCanvas.tsx` yet — wire the existing one in, or explicitly flag that it's out of scope.
- ❌ Don't construct decorator chains anywhere except `FabricKernelFacade.cs` (C#) / `canvasCompositionRoot.ts` (TS).
- ❌ Don't add a new `if (msg.type === ...)` branch to `onWasm` — add an entry to `wasmEventHandlers`.
- ❌ Don't reach for a full Decorator class to fix a single duplicated guard — use a static helper like `KernelContext.TryGetCommandHandler` when only one guard is duplicated.
- ❌ Don't touch Graphics Kernel source to make a pattern "cleaner."
- ❌ Don't modify or rename any `.spec.ts` file under `graphicseditor.shell.web/tests/`.
- ❌ Don't remove or "simplify away" the cached, per-type reflection in `FabricDisplayBoot.Reflection.cs` — it's required kernel access, not gratuitous reflection (see `common-pitfalls-checklist` skill).

---

## Step-by-step refactor procedure

1. **Check ground truth first.** Look at the tables above and the actual files — confirm whether the thing you're about to build already exists (even if unwired). Reuse/extend/wire it before creating anything new.
2. If a `Docs\refactor\*.md` plan conflicts with what's actually implemented, **follow the implementation**, and note the discrepancy in your design note (see step 8) rather than silently "correcting" the code back to the plan.
3. Introduce interfaces/contracts first, with zero behavior change, if the concern doesn't already have one.
4. Put real logic in an `XxxImpl` method in the relevant `FabricDisplayBoot.{Area}.cs` partial (C#) or a small pure function/module (TS); keep the service/handler as a thin wrapper.
5. Extract Strategy table entries / Template Method steps / Decorators following the exact folder and naming conventions in the Ground Truth tables above.
6. Wire everything in the single composition root file for that stack (`FabricKernelFacade.cs`, `FabricDisplayBoot.Composition.cs`, or `canvasCompositionRoot.ts`) — never ad hoc elsewhere.
7. Never modify Graphics Kernel source or `.spec.ts` files.
8. Validate with the smallest relevant build/test command; do not add new tooling.
9. Capture the design decision in a short note under `Docs\refactor\` (pattern chosen, why, what was reused vs. newly created, and any intentional deviation from an existing plan doc).

## Validation checklist before calling a refactor complete

- [ ] Checked the Ground Truth tables and reused/wired existing scaffolding instead of duplicating it.
- [ ] New files live under the existing folder names (`core`, `services`, `decorators`, `events`/`events/strategies`, `facade`, `composition` on TS; `Services`, `Services/Contracts`, `Services/Decorators`, `Facade`, `FabricDisplayBoot.Composition.cs` on C#) — no new top-level pattern folders invented.
- [ ] No `Commands/` folder was added for transform-style operations.
- [ ] Decorator order matches what's documented in `FabricKernelFacade.cs` / `canvasCompositionRoot.ts` exactly, including the intentional C#/TS asymmetry.
- [ ] Any Result/Option usage stays a small local tagged union — no external FP library, no RxJS.
- [ ] Strategy classes (if added) delegate to the dispatch-table handler, not duplicate it.
- [ ] Kernel source and `.spec.ts` files untouched.
- [ ] A short design-decision note was written, including any deviation from a `Docs\refactor\` plan.
