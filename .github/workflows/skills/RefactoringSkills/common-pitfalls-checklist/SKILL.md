---
name: common-pitfalls-checklist
description: >
  Checklist of recurring anti-patterns in this codebase's ReactJS/TypeScript
  canvas layer and C# WASM host — hacky timers, unnecessary reflection, and
  similar pitfalls. Use during code review of any change to
  graphicseditor.shell.web/src or FabricWasmHost to confirm none of these
  pitfalls were introduced or reintroduced.
---

# Common Pitfalls Checklist

This skill is a targeted addition to `code-smell-detection` — it exists
because these specific pitfalls have concrete historical instances in this
repo and are easy to reintroduce during a refactor.

---

## Pitfall 1 — Hacky timers in React/JS

### What "hacky" looks like
- A recursive `setTimeout`/`setInterval` retry loop written **inline** inside a
  component with no named class, no bounded attempt count, or no cleanup on
  unmount.
- A bare `setTimeout(fn, <magic number>)` used to "wait for the DOM/script to
  be ready" with no comment explaining what condition it's actually polling for.
- Timers whose callback closes over stale component state (missing
  cleanup/`clearTimeout` in a `useEffect` return).

### What is acceptable here
`FabricEditorCanvas.tsx` legitimately needs `setTimeout` because FabricJS/WASM
script loading and the browser paint cycle are asynchronous and cannot be
awaited directly. This is **documented** in
`Docs\refactor\fp-practices-declarative-style-overview.md` as a constraint
that must be preserved, not eliminated.

### The bar for "acceptable timer usage"
1. Bounded attempts (`maxAttempts`) and an explicit delay constant — no
   unbounded recursion.
2. Wrapped in a single, named class/decorator (e.g. `RetryCanvasSyncDecorator`)
   — not re-implemented inline at each call site.
3. Logs a clear warning when it gives up (`console.warn('...timed out after N attempts')`).
4. Cleans up (`clearTimeout`) if the component unmounts before the timer fires,
   when used inside a React component/`useEffect`.
5. Polls an explicit, named readiness condition
   (`window.__fabricWasm?.isReady && window.graphics?.initFabricEditor`) — never
   a bare fixed delay with no condition check.

### Review action
- If you find a **new** inline recursive timeout not wrapped in a class → flag as Critical, point to `RetryCanvasSyncDecorator` as the template.
- If you find an **existing, documented** constraint-driven timer (paint cycle, script load) already wrapped in a decorator → do not flag.
- If a timer has no bound/no logging/no cleanup → flag regardless of location.

---

## Pitfall 2 — Unnecessary C# reflection

### What "unnecessary" looks like
- Reflection used to reach a field/method that already has (or could easily
  have) a public/internal accessor — used only to skip writing an interface
  or a one-line public wrapper.
- Reflection called fresh on every invocation without caching the
  `FieldInfo`/`MethodInfo`, causing avoidable per-call reflection overhead.
- Reflection used against **this project's own code** (not the Graphics
  Kernel) — if you own the type, add a proper member instead of reflecting
  into it.
- Reflection that silently swallows `TargetException`/`MissingMethodException`
  with no log line, hiding a real integration bug.

### What is legitimate here
`FabricWasmHost\FabricDisplayBoot.Reflection.cs` uses reflection **only**
because:
- `_configItem` is a private field on kernel type `GraphicItem` with no public
  accessor, and the field's declaring type varies per concrete GIV subclass
  (kernel constraint — do not "fix" by modifying kernel source).
- `SetRotation`/`ApplyTransform` are non-public kernel methods that must be
  invoked to persist transform state so `Context.Save()` serializes it
  correctly; there is no public kernel API for this.
- Both usages **cache** the resolved `FieldInfo`/`MethodInfo` in a
  `Dictionary<Type, ...>` keyed per concrete type (WASM is single-threaded, so
  no locking is needed) — this is the required pattern, not optional polish.
- Failures are logged (`Console.WriteLine($"[FabricWasm] ... FAILED ...")`),
  never silently swallowed.

### The bar for "legitimate reflection usage"
1. Target member is genuinely private/internal in **kernel** code with no
   public accessor and the kernel must not be modified.
2. Resolved `FieldInfo`/`MethodInfo` is cached per-`Type`, not looked up on
   every call.
3. Failure path logs a message identifying the type and operation — never a
   bare empty `catch {}`.
4. A comment explains *why* reflection is required (what public API is
   missing and what would break without it) — see the XML doc comments in
   `FabricDisplayBoot.Reflection.cs` as the template to match.

### Review action
- New reflection against **this repo's own C# types** (not kernel) → flag as Critical; require a public member/interface method instead.
- New reflection against kernel types without caching → flag as Moderate; require the `Dictionary<Type, FieldInfo/MethodInfo>` cache pattern.
- New reflection with an empty/silent catch → flag as Critical.
- Existing, cached, logged, kernel-constrained reflection (matching the four criteria above) → do not flag; cite `FabricDisplayBoot.Reflection.cs` as precedent in the review note.

---

## Pitfall 3 — Other recurring smells worth a dedicated check

- **Global mutable window access without a guard**: `(window as any).__fabricWasm.foo()` called directly instead of through a readiness-checked bridge/facade.
- **Silent catch-all swallowing** (`catch { }` / `catch (Exception) { }` with no log) anywhere other than the single documented outermost error-boundary decorator.
- **Kernel source edits**: any diff touching `NetStandard/GraphicsKernel` or `Source/Kernel/GraphicsKernel` — always flag as Critical regardless of intent; kernel must be reused, never modified.
- **Playwright test tampering**: any diff touching a `.spec.ts` file under `graphicseditor.shell.web/tests/` (rename, selector change, assertion change) — always flag as Critical.
- **Client-side persistence of display/element data**: any use of `localStorage`/`sessionStorage`/IndexedDB to persist display or element data instead of server-side persistence — always flag as Critical per workspace instructions.
- **Not a pitfall**: the small local tagged-union `Result`/`Option` types in `canvas\utils\result.ts` / `utils\option.ts` are an accepted, deliberate convention in this repo (see `design-pattern-refactoring` skill) — do not flag their existence or normal use as introducing "FP monads." Only flag if such a type grows beyond a handful of named functions (e.g. gains `flatMap`/`traverse`/applicative helpers) or an external FP library gets added.

---

## Output format for reviewers using this checklist

```markdown
### Pitfall check: <file>
- [x] Hacky timers — none found / found at line N (see above)
- [x] Unnecessary reflection — none found / found at line N (see above)
- [x] Kernel source untouched
- [x] No .spec.ts changes
- [x] No client-side persistence of display/element data
```
