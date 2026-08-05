---
name: graphics-kernel-giv-editor
description: >-
  Expert guidance for implementing a FabricJS graphics editor wired to the PG2 Graphics Kernel
  running as browser-WASM. Use when: implementing GIV-to-FabricJS mapping, adding GIV segregation,
  wiring manipulation (move/resize/rotate) back to the kernel, implementing grouping via groupId,
  drag-and-drop from toolbox, properties panel callbacks, or fixing SVG rendering in SvgDrawingAdapter.cs.
argument-hint: '<task: layout|grouping|manipulation|drag-drop|properties|svg-rendering>'
user-invocable: false
---

# Graphics Kernel GIV Editor Skill

## Hard Constraints (Never Violate)

1. **Never modify the Graphics Kernel source.**
   - Kernel locations (read-only): `NetStandard/GraphicsKernel/` and `Source/Kernel/GraphicsKernel/`
   - The ONLY file to modify for rendering fixes: `FabricWasmHost/SvgDrawingAdapter.cs`
2. **Each root GIV = one FabricJS canvas object.** Child visuals within the same GIV are composited into a single SVG, not split into separate objects.
3. **Kernel-returned positions are authoritative.** After any move/resize/rotate call, apply the returned `GivInfo` coordinates back to the FabricJS object. Never let FabricJS keep its own transformed state.

---

## Architecture Overview

```
Graphics Kernel (C#, WASM)
  └─ ElementViewVisual               ← root container per display
       └─ GraphicItemVisual [N]      ← one per logical GIV (motor, valve, etc.)
            └─ DrawingVisual tree    ← actual draw commands (rect, ellipse, path…)
                   │
                   ▼ static delegate hooks (BeginCapture / EndCapture)
          SvgDrawingAdapter.cs  ◄── ONLY file to modify for rendering
                   │
          GetCapturedGivs() → List<CapturedGiv>
          GetTreeNodes(roots) → flat list with parentIndex/depth
                   │
          FabricDisplayBoot.cs  (WASM [JSExport] entry points)
          ├─ InitAndRender()     → layout JSON (givs with x,y,w,h,parentIndex,depth)
          ├─ GetGivSvg(index)    → SVG string for a single GIV
          ├─ MoveGiv / ResizeGiv / RotateGiv / RotateGivAroundPoint
          └─ CreateGiv           → kernel CreateManipulator
                   │
                   ▼ window.__fabricWasm JS interop
          WasmBridge.ts  ──► GivManager.ts  ──► FabricJS canvas
                                    │
                          GivContextRegistry.ts   (givIndex→ctx, fabricId→ctx)
                          GivDrawingContext.ts     (per-GIV move/resize/rotate)
                          GivGroupContext.ts       (not yet wired — see grouping section)
```

### Key source files

| File | Purpose |
|------|---------|
| `FabricWasmHost/SvgDrawingAdapter.cs` | Hooks kernel drawing delegates; builds composite SVG per GIV |
| `FabricWasmHost/FabricDisplayBoot.cs` | WASM `[JSExport]` entry point; owns `_capturedGivs` list |
| `GraphicsEditor.FabricJS/src/bridge/WasmBridge.ts` | Async wrappers over `window.__fabricWasm` |
| `GraphicsEditor.FabricJS/src/bridge/types.ts` | `GivInfo`, `DisplayLayout`, `FabricWasmApi` interfaces |
| `GraphicsEditor.FabricJS/src/giv/GivManager.ts` | Loads root GIVs onto canvas; creates `GivDrawingContext` per GIV |
| `GraphicsEditor.FabricJS/src/giv/GivDrawingContext.ts` | Per-GIV context: move/resize/rotate/notifySelected |
| `GraphicsEditor.FabricJS/src/giv/GivGroupContext.ts` | Multi-GIV group (not yet wired at kernel level) |
| `GraphicsEditor.FabricJS/src/giv/GivContextRegistry.ts` | Singleton: givIndex→ctx, fabricId→ctx |
| `GraphicsEditor.FabricJS/src/giv/GivMetadata.ts` | fabricId→GivInfo for hit-testing |
| `GraphicsEditor.FabricJS/src/canvas/FabricCanvasView.tsx` | Canvas React component; wires Fabric events to contexts |

---

## GIV Segregation: The Core Rule

### What a GIV Is

A **GIV** (Graphic Item Visual) corresponds to one `ElementViewVisual` in the kernel visual tree.
Its children (`GraphicItemVisual` nodes and their `DrawingVisual` descendants) are ALL part of the same GIV and must be composited into **one SVG string**.

```
ElementViewVisual [GIV index=3]           ← becomes ONE FabricJS object
  ├─ GraphicItemVisual (motor symbol)      ← part of GIV 3's SVG
  │    ├─ DrawingVisual (bowtie shape)     ← part of GIV 3's SVG
  │    └─ DrawingVisual (shading poly)    ← part of GIV 3's SVG
  └─ GraphicItemVisual (label "M")        ← still part of GIV 3's SVG
```

### Wrong: splitting children into separate objects

```typescript
// ❌ WRONG — creates N FabricJS objects for one GIV
for (const child of giv.children) {
  const img = await FabricImage.fromURL(bridge.getGivSvg(child.index))
  canvas.add(img)
}
```

### Right: one object per root GIV

```typescript
// ✅ CORRECT — only root-level GIVs (parentIndex === -1) become canvas objects
const rootGivs = layout.givs.filter(g => (g.parentIndex ?? -1) === -1)
for (const giv of rootGivs) {
  const svgStr = bridge.getGivSvg(giv.index)   // composite SVG for the whole GIV
  const img = await FabricImage.fromURL(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`)
  img.set({ left: giv.x, top: giv.y, originX: 'left', originY: 'top' })
  ;(img as any).id = `giv-${giv.index}`
  canvas.add(img)
}
```

---

## SvgDrawingAdapter Internals

> `FabricWasmHost/SvgDrawingAdapter.cs` — the bridge between the kernel's WPF-like visual tree and SVG strings. **Never modify the kernel; fix rendering here.**

### Internal data structures

```csharp
// Per-visual drawing state — one per DrawingVisual that calls RenderOpen
private sealed class VisualState
{
    public List<string> Lines { get; } = new();       // SVG draw commands (rect, ellipse, path, text...)
    public List<string> Defs { get; } = new();        // <defs> entries: linearGradient, radialGradient, clipPath
    public Stack<string> GroupStack { get; } = new(); // open <g> closers from PushTransform/PushClip/PushOpacity
    public Rect Bounds = Rect.Empty;                  // accumulated bounding box in local drawing coordinates
    public bool Completed;                            // true after RenderClose fires
    public int DefsCounter;                           // used to generate unique gradient/clip IDs
    public string TypeName;                           // kernel type name (two formats — see GivInfo section)
    public long VisualId;                             // Visual.Id (stable key for manipulations)
    public GraphicItem GraphicItem;                   // kernel item; needed for GetResizeHandleBox()
    public double TransformX;                         // last known position from Transform matrix
    public double TransformY;
    public double TransformAngle;                     // degrees via atan2(M21, M11)
    public Transform TransformMatrix;
}
```

```csharp
// Produced by GetCapturedGivs / GetTreeNodes — handed to TypeScript as layout JSON + SVG
internal sealed class CapturedGiv
{
    public int Index { get; set; }           // 0-based; stable index for GetGivSvg / manipulation API
    public long VisualId { get; set; }       // Visual.Id; key for ResetVisualState / GetUpdatedCapturedGiv
    public double X { get; set; }            // display-space left (overridden by GetResizeHandleBox for roots)
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public double Angle { get; set; }
    public string SvgContent { get; set; }   // complete <svg>…</svg> string
    public string TypeName { get; set; }
    public GraphicItem GraphicItem { get; set; }  // retained for manipulation API
    public int ParentIndex { get; set; } = -1;    // -1 = root; ≥0 = sub-item
    public int Depth { get; set; } = 0;
}
```

### GIV root detection

`HandleAddVisualChild` detects the canonical grouping pattern the first time it fires:

```csharp
if (_rootElementViewVisual == null
    && parent?.GetType().Name == "ElementViewVisual"
    && child?.GetType().Name == "GraphicItemVisual")
{
    _rootElementViewVisual = parent as dynamic;
}
```

Once found, `_rootElementViewVisual` is used as the authoritative ordered child list (matches visual render order exactly).

### GetCapturedGivs — two paths

**Path 1 (preferred):** Iterates `_rootElementViewVisual.Children` in order:
- Child is a `GraphicItemVisual` with a `Completed` `VisualState` → use directly.
- Child has no `VisualState` but exists in `_childrenMap` → `CreateSyntheticState()` for `ElementInstance` GIVs that never call `RenderOpen` (they delegate all drawing to a sub-`ElementViewVisual` tree).
- Child has neither → skip.

**Path 2 (fallback):** `GetCapturedGivsFromCompletedOrder()` — uses `_completedOrder` insertion order. A visual is treated as a root if its parent is absent from `_visuals`, or if its parent has zero draw lines (pure container). Pure-container visuals with completed children are also skipped.

### BuildCompositeCapturedGiv — composite SVG algorithm

```
1. Start with rootState.Lines + rootState.Defs
2. AppendChildrenSvg(rootId, ...):
     for each childId in _childrenMap[parentId]:
       - collect child's Defs
       - emit <g transform="matrix(...)"> if child has a positional transform
       - emit child's Lines
       - recurse for grandchildren
       - emit </g>
       - union child bounds (offset by transform if present)
3. Position (X, Y):
     walk parent chain accumulating Transform.OffsetX/Y
4. SVG string:
     <svg viewBox="x y w h" width="w" height="h">
       <defs>…all collected defs…</defs>
       …all collected lines…
     </svg>
     (svgPad = 8 added on all sides to avoid stroke clipping)
```

For root GIVs (`ParentIndex == -1`), `BuildLayoutJson` further overrides `X/Y/W/H` with `GraphicItem.GetResizeHandleBox()` — the kernel's authoritative canvas-space bounding box.

### GetTreeNodes — tree panel data

```csharp
// Phase 1: all roots, ParentIndex=-1, Depth=0, Index=i
// Phase 2: CollectDirectSubItems — walks _childrenMap recursively:
//   - adds GraphicItem-bearing, Completed visuals whose direct parent is a container (no GraphicItem)
//   - container nodes (EVV, no GraphicItem) are traversed transparently
//   - sub-visuals of an already-added GIV (e.g. TextItem.frameVisual) are skipped
//   - depth guard: if depth > 4, recursion stops silently
```

Sub-item `X/Y` comes from `BuildCompositeCapturedGiv` (transform-derived), not `GetResizeHandleBox`.

### WASM entry points (FabricDisplayBoot.cs)

| Entry point | Description |
|-------------|-------------|
| `InitAndRender(displayDataJson, genericElementDataJson)` | Bootstrap kernel; returns layout JSON |
| `GetGivSvg(givIndex)` | Returns `_capturedGivs[givIndex].SvgContent` — **not consumed/cleared** |
| `MoveGiv(givIndex, dx, dy)` | Translates by delta; returns updated `GivInfo` JSON |
| `ResizeGiv(givIndex, scaleX, scaleY, originX, originY)` | Scale-aware resize with rotation decomposition |
| `RotateGiv(givIndex, angleDegrees)` | Rotate around item center |
| `RotateGivAroundPoint(givIndex, angleDegrees, pivotX, pivotY)` | Rotate around arbitrary point |
| `CreateGiv(typeId, x, y, width, height)` | Kernel `CreateManipulator`; adds new GIV |

### Manipulation state lifecycle

```csharp
// Example: MoveGiv (ResizeGiv / RotateGiv follow the same pattern)
var item = GetItem(givIndex);              // GraphicItem from _capturedGivs[givIndex]
long visualId = item.ItemDrawingVisual.Id;

_adapter.ResetVisualState(visualId);       // clear Lines/Defs/GroupStack/Bounds/Completed

var m = new Matrix(); m.Translate(dx, dy);
object restoreState = null;
item.AnimateTransformItem(m, ref restoreState, elementView);  // triggers re-render hooks

// Two recovery paths for updated state:
var updated = _adapter.GetUpdatedCapturedGiv(visualId)           // preferred: re-render fired
           ?? _adapter.GetUpdatedCapturedGivFromTransform(visualId); // fallback: transform-only

_capturedGivs[givIndex] = updated;         // replace cached entry
return SerializeGivInfo(givIndex, item);   // x,y,w,h from GetResizeHandleBox; angle from ShearX
```

**⚠️ Stale SVG on transform-only path:** `GetUpdatedCapturedGivFromTransform` returns `SvgContent = existing.SvgContent` unchanged. Only `X`/`Y`/`Angle` metadata updates. A subsequent `GetGivSvg(index)` returns the pre-manipulation drawing coordinates. `GivDrawingContext.refreshSvg()` is currently a stub — wiring it is an open implementation gap.

---

## The GivInfo Contract

```typescript
// From: GraphicsEditor.FabricJS/src/bridge/types.ts
export interface GivInfo {
  index: number        // 0-based position in kernel's GIV list
  hash?: number        // Visual.Id from kernel (= CapturedGiv.VisualId)
  x: number            // left edge in display coordinates (top-left origin)
  y: number            // top edge in display coordinates
  width: number        // pixel width of GIV bounding box
  height: number       // pixel height of GIV bounding box
  typeName?: string    // kernel type name; see TypeName sources below
  angle?: number       // rotation in degrees via rot.ShearX (kernel encoding)
  parentIndex?: number // -1 for root GIVs; ≥0 for sub-items (tree panel only)
  depth?: number       // 0 for root GIVs; tree depth for sub-items
}
```

**`x/y` are top-left coordinates.** Always set FabricJS `originX: 'left', originY: 'top'` to match.

### Layout JSON from `InitAndRender` (actual structure)

```json
{
  "displayId": "PG2_test:Chart_Display",
  "displayWidth": 800,
  "displayHeight": 600,
  "givCount": 12,
  "givs": [
    { "index": 0, "hash": 12345, "x": 100.0, "y": 200.0, "width": 80.0, "height": 60.0,
      "typeName": "Motor", "parentIndex": -1, "depth": 0 },
    { "index": 12, "hash": 67890, "x": 0.0, "y": 0.0, "width": 60.0, "height": 40.0,
      "typeName": "MotorSymbol", "parentIndex": 0, "depth": 1 }
  ]
}
```

- `givCount` = number of **root** items only (`parentIndex == -1`).
- `givs` array = roots **plus** sub-items. Sub-items have non-canonical `x/y` (transform-derived, not `GetResizeHandleBox`).
- No `groupId` field — grouping is expressed through `parentIndex`/`depth` hierarchy.

### TypeName sources (two formats)

| Source | Method | Format example |
|--------|--------|----------------|
| Normal GIV (`HandleRenderOpen`) | Reflection: `FullTypeName` property | `"GraphicPrimitives:Rectangle"` |
| Synthetic GIV (`CreateSyntheticState`) | Reflection: `item.GetType().Name` | `"ElementInstance"` |
| Composite merge | First non-null child typeName | may come from grandchild |

Callers comparing `typeName` strings must account for both formats.

### `angle` encoding

`SerializeGivInfo` encodes rotation as `rot.IsIdentity ? 0.0 : rot.ShearX` — a kernel-internal value from `RotateData.ShearX`. This is NOT a standard rotation-matrix angle; it is the kernel's internal shear component that numerically equals the rotation angle in degrees for pure rotations.

---

## Layout: Placing GIVs on the Canvas

### The position contract

1. Use `giv.x`, `giv.y` from `GivInfo` as the FabricJS `left`/`top` directly.
2. Use `giv.width`, `giv.height` as the natural SVG size.
3. If **all** GIVs report `(0,0)` → kernel didn't supply positions → use the auto-tiling fallback.

```typescript
function resolveCanvasPositions(givs: GivInfo[]): Map<number, { x: number; y: number }> {
  const allAtOrigin = givs.every(g => Math.round(g.x) === 0 && Math.round(g.y) === 0)
  const positions = new Map<number, { x: number; y: number }>()

  if (allAtOrigin) {
    // Fallback grid — purely for display when kernel has no position data
    const TILE_SIZE = 100, TILE_GAP = 12, TILE_COLS = 4
    givs.forEach((giv, i) => {
      const col = i % TILE_COLS, row = Math.floor(i / TILE_COLS)
      positions.set(giv.index, { x: TILE_GAP + col * (TILE_SIZE + TILE_GAP), y: 420 + row * (TILE_SIZE + TILE_GAP) })
    })
  } else {
    givs.forEach(giv => positions.set(giv.index, { x: giv.x, y: giv.y }))
  }
  return positions
}
```

### Display dimensions

```typescript
// The canvas must be sized to the kernel's display dimensions
const layout = await bridge.initAndRender(displayDataJson, genericElementDataJson)
const fc = new Canvas(canvasEl, {
  width: Math.max(layout.displayWidth, 800),
  height: Math.max(layout.displayHeight, 600),
  backgroundColor: 'transparent',
})
```

---

## FabricJS Custom Object Pattern

> **Use `FabricImage` for SVG GIVs** (existing pattern). For future native vector GIVs, use a custom class:

```typescript
import { FabricObject, util, classRegistry } from 'fabric'

export class GivObject extends FabricObject {
  static type = 'GivObject'

  declare givIndex: number
  declare svgDataUrl: string

  private _img: HTMLImageElement | null = null

  constructor(options: { givIndex: number; svgDataUrl: string } & Record<string, any>) {
    super(options)
    this.givIndex = options.givIndex
    this.svgDataUrl = options.svgDataUrl
    // ⚠️ CRITICAL: disable FabricJS object caching
    // Without this, stale SVG renders after kernel updates (silent bug)
    this.objectCaching = false
    this.originX = 'left'    // always left/top to match kernel x/y
    this.originY = 'top'
    this._loadImage()
  }

  private _loadImage() {
    const img = new Image()
    img.onload = () => { this._img = img; this.dirty = true; this.canvas?.requestRenderAll() }
    img.src = this.svgDataUrl
  }

  _render(ctx: CanvasRenderingContext2D) {
    if (!this._img) return
    const w = this.width, h = this.height
    // FabricJS _render origin is object center — offset back to top-left
    ctx.drawImage(this._img, -w / 2, -h / 2, w, h)
  }

  updateSvg(newDataUrl: string) {
    this.svgDataUrl = newDataUrl
    this._img = null
    this._loadImage()
  }
}

classRegistry.setClass(GivObject)
```

**Why `objectCaching: false`?**
FabricJS caches each object to an offscreen canvas. After `moveGiv/resizeGiv` returns new coordinates and the SVG changes, FabricJS will serve the cached (stale) image unless caching is disabled or `this.dirty = true` is set explicitly on each update.

---

## GIV Grouping: parentIndex / depth Hierarchy

The kernel adapter does **not** emit a `groupId` field. Logical grouping is expressed entirely through `parentIndex` and `depth` in the layout JSON (produced by `GetTreeNodes`).

### How the tree is structured

```
givs[0] = { index:0, typeName:"Motor",       parentIndex:-1, depth:0 }   ← root GIV
givs[1] = { index:1, typeName:"MotorSymbol", parentIndex:0,  depth:1 }   ← sub-item
givs[2] = { index:2, typeName:"MotorLabel",  parentIndex:0,  depth:1 }   ← sub-item
givs[3] = { index:3, typeName:"Valve",       parentIndex:-1, depth:0 }   ← root GIV
```

- Only items with `parentIndex === -1` are placed on the canvas as manipulable FabricJS objects.
- Sub-items (`depth ≥ 1`) are shown in the tree-view panel only — they share the parent root's composite SVG.
- `CollectDirectSubItems` stops at `depth > 4` (hard guard — deeply nested `ElementInstance` trees are silently truncated).

### ⚠️ `detectAndCreateGroups` is not yet wired

`GivManager.ts` contains a `detectAndCreateGroups` function that groups FabricJS objects by `ctx.givInfo.groupId`. Because the kernel adapter **never populates** `groupId` (it is absent from the layout JSON), this function always produces zero `fabric.Group` objects — it is permanently a no-op at runtime.

`GivGroupContext`, `GivContextRegistry.registerGroup()`, and `GivContextRegistry._groupContexts` are therefore also never exercised.

**To implement explicit grouping** (e.g. group-select related GIVs), populate `groupId` in `BuildLayoutJson` from a kernel-level grouping attribute, then wire `detectAndCreateGroups` as follows:

```typescript
// detectAndCreateGroups — as currently written in GivManager.ts (for reference)
// Groups by ctx.givInfo.groupId (currently always undefined → no-op)
for (const ctx of allContexts) {
  const gid = ctx.givInfo.groupId   // currently undefined from adapter
  if (!gid) continue
  // … build fabric.Group …
}
```

Until `groupId` is wired, FabricJS-level grouping must be implemented using `parentIndex`:

```typescript
// Group root GIVs that share direct children in the tree (parentIndex-based approach)
const rootMap = new Map<number, GivInfo[]>()
for (const giv of layout.givs) {
  if ((giv.parentIndex ?? -1) >= 0) {
    const siblings = rootMap.get(giv.parentIndex!) ?? []
    siblings.push(giv)
    rootMap.set(giv.parentIndex!, siblings)
  }
}
// rootMap keys are root indices that have sub-items — could be wrapped in fabric.Group
```

### fabric.Group critical gotcha

When constructing `new Group(members)`, FabricJS recalculates member positions relative to the group bounding-box center. Reapply the kernel `x/y` to the group after construction and set `subTargetCheck: false`:

```typescript
const group = new Group(fabricObjects, {
  subTargetCheck: false,
  originX: 'left',
  originY: 'top',
})
group.set({ left: groupX, top: groupY })
group.setCoords()
```

---

## Manipulation Roundtrip (Move / Resize / Rotate)

### The complete flow

```
User gesture (FabricJS)
       │
       ▼ object:modified event
  FabricCanvasView.tsx handleObjectModified()
       │
       ▼ registry.getContextByFabricId(id)
  GivDrawingContext
       │ .move(dx, dy)  or  .resize(w, h)  or  .rotate(angle)
       ▼
  WasmBridge.ts  → window.__fabricWasm.moveGiv(index, dx, dy)
       │
       ▼ returns updated GivInfo (kernel-authoritative)
  GivDrawingContext._applyKernelInfo()
       │  obj.set({ left: updated.x, top: updated.y, width: updated.width, height: updated.height })
       ▼
  canvas.requestRenderAll()
```

### Event handler implementation

```typescript
// In FabricCanvasView.tsx — wire to canvas after canvas is created
canvas.on('object:modified', async (e) => {
  const obj = e.target
  if (!obj) return
  const id = (obj as any).id as string | undefined
  if (!id) return

  const ctx = registry.getContextByFabricId(id)
  if (!ctx || !(ctx instanceof GivDrawingContext)) return

  // Guard: suppress echo when we called set() ourselves (avoids re-entry)
  if (ctx.canSuppressModified()) return

  // Determine what changed
  const dx = (obj.left ?? 0) - ctx.givInfo.x
  const dy = (obj.top ?? 0) - ctx.givInfo.y
  const newW = (obj.width ?? 0) * (obj.scaleX ?? 1)
  const newH = (obj.height ?? 0) * (obj.scaleY ?? 1)
  const newAngle = obj.angle ?? 0

  const posChanged = dx !== 0 || dy !== 0
  const sizeChanged = Math.abs(newW - ctx.givInfo.width) > 0.5 || Math.abs(newH - ctx.givInfo.height) > 0.5
  const angleChanged = Math.abs(newAngle - (ctx.givInfo.angle ?? 0)) > 0.1

  try {
    if (posChanged && !sizeChanged && !angleChanged) {
      await ctx.move(dx, dy)
    } else if (sizeChanged) {
      await ctx.resize(newW, newH)
      // Reset scale to 1 after resize so kernel dimensions are used directly
      obj.set({ scaleX: 1, scaleY: 1 })
    } else if (angleChanged) {
      await ctx.rotate(newAngle)
    }
    canvas.requestRenderAll()
  } catch (err) {
    console.error(`[GIV modified] failed for ${id}:`, err)
  }
})
```

### GivDrawingContext._applyKernelInfo (complete)

After every WASM call, apply the returned `GivInfo` back to the FabricJS object:

```typescript
private _applyKernelInfo(): void {
  const info = this._givInfo
  if (!info.width || info.width <= 0 || !info.height || info.height <= 0) return

  this._fabricObject.set({
    left: info.x,
    top: info.y,
    width: info.width,
    height: info.height,
    angle: info.angle ?? 0,
    scaleX: 1,    // always reset scale — kernel owns dimensions
    scaleY: 1,
  })
  this._fabricObject.setCoords()  // update bounding box for hit-testing
}
```

---

## Drag-and-Drop from Toolbox

Drag-and-drop must call `bridge.createGiv()` which internally invokes the kernel's `CreateManipulator`. The kernel creates a new `ElementViewVisual`, renders it, and returns a `GivInfo`.

```typescript
// In FabricCanvasView.tsx onDrop handler
const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault()
  const typeName = e.dataTransfer.getData('text/plain')
  if (!typeName) return

  const canvas = fabricRef.current
  if (!canvas) return

  // Convert DOM drop coordinates to canvas coordinates
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const dropX = (e.clientX - rect.left) / (canvas.getZoom() ?? 1)
  const dropY = (e.clientY - rect.top) / (canvas.getZoom() ?? 1)

  try {
    // This calls kernel CreateManipulator internally
    const givInfo = await wasmBridge.createGiv(typeName, dropX, dropY, 80, 60)

    // Get rendered SVG from kernel
    const svgStr = wasmBridge.getGivSvg(givInfo.index)
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`
    const img = await FabricImage.fromURL(svgUrl)

    img.set({
      left: givInfo.x,
      top: givInfo.y,
      originX: 'left',
      originY: 'top',
      selectable: true,
    })
    ;(img as any).id = `giv-${givInfo.index}`

    setGivMetadata(`giv-${givInfo.index}`, { ...givInfo })
    const ctx = new GivDrawingContext(givInfo.index, img, givInfo)
    registry.registerContext(givInfo.index, ctx)

    canvas.add(img)
    canvas.setActiveObject(img)
    canvas.requestRenderAll()
  } catch (err) {
    console.error('createGiv failed:', err)
    // Optionally: show a fallback placeholder
  }
}
```

---

## Properties Panel Callback

When a GIV is selected, call `ctx.notifySelected()` which calls `bridge.getGivProperties(index)` and fires all registered callbacks.

```typescript
// Register callback on GivDrawingContext
ctx.onSelected((props: GivProperty[]) => {
  setPropertiesPanelData(props)  // update React state for properties panel
})

// Selection event in FabricCanvasView.tsx
canvas.on('selection:created', () => {
  const active = canvas.getActiveObject()
  if (!active) return
  const id = (active as any).id as string
  const ctx = registry.getContextByFabricId(id)
  if (ctx instanceof GivDrawingContext) {
    ctx.notifySelected().catch(console.error)
  }
})
```

### GivProperty interface

```typescript
export interface GivProperty {
  name: string           // internal property key
  displayName: string    // label shown in properties pane
  value: any             // current value
  category?: string      // grouping header e.g. "Appearance", "Position"
  isReadOnly?: boolean
  editable?: boolean
}
```

---

## SVG Rendering: Colour Pipeline in SvgDrawingAdapter.cs

> **Critical constraint**: All colour fixes go in `SvgDrawingAdapter.cs` only. Never modify kernel brush/colour sources.

### Colour pass-through

Colours are passed directly from kernel brushes to SVG attributes without any sentinel replacement or custom mapping. This mirrors the approach in the reference `BrushExtensions.cs`:

```csharp
private static string ColorToFill(Color c)
{
    string rgb = $"rgb({c.R},{c.G},{c.B})";
    double a = Math.Round(c.A / 255.0, 3);
    return a < 1.0
        ? string.Format(Inv, "fill=\"{0}\" fill-opacity=\"{1:F3}\"", rgb, a)
        : $"fill=\"{rgb}\"";
}
```

Gradient stops follow the same pattern — use `sc.R/G/B` and `sc.A / 255.0` directly. Text fill uses the same `BrushToFill` as shapes; no separate text-specific colour logic is needed.

---

## Canvas Background

The canvas `backgroundColor` is `'transparent'` (matching the reference viewer). The surrounding page CSS controls any visible background:

```typescript
// In FabricCanvasView.tsx
const fc = new Canvas(canvasEl, {
  backgroundColor: 'transparent',
  // ...
})
```

---

## Loading Sequence

```typescript
async function initGraphicsEditor(
  canvas: Canvas,
  displayDataJson: string,
  genericElementDataJson: string
): Promise<void> {
  // 1. Initialize kernel + render all GIVs
  const layout = await wasmBridge.initAndRender(displayDataJson, genericElementDataJson)

  // 2. Clear any previous state
  canvas.clear()
  clearGivMetadata()
  registry.clear()

  // 3. Place all root GIVs (parentIndex === -1) onto canvas
  await loadGivsOntoCanvas(canvas, layout, wasmBridge)

  // 4. Sub-items (depth >= 1) are for tree-view only — do NOT add to canvas

  canvas.requestRenderAll()
}
```

---

## Critical Gotchas

### 1. `fabric.Group` re-origins members
When constructing `new Group(members)`, FabricJS computes member positions relative to the **group's bounding-box center**. All member `left/top` values are recomputed. After construction, re-apply the desired `x/y` to the group itself (not individual members), and set `originX: 'left', originY: 'top'`.

### 2. `objectCaching` must be false for kernel-updated objects
FabricJS caches rendered objects to an offscreen canvas. After `moveGiv/resizeGiv` the SVG content may change. With `objectCaching: true`, FabricJS silently shows the stale render. Set `objectCaching: false` or call `obj.dirty = true` after every kernel update.

### 3. `originX/originY` must be `'left'/'top'` for all kernel-bound objects
`GivInfo.x` and `GivInfo.y` are **top-left** coordinates. FabricJS defaults to `'center'/'center'`. Explicitly set `originX: 'left', originY: 'top'` or positions will be off by half the object dimensions.

### 4. `scaleX/scaleY` must reset to 1 after resize
After calling `ctx.resize(newW, newH)`, the kernel owns dimensions in `width/height`. If FabricJS retains `scaleX/scaleY != 1` from the gesture, the object appears double-scaled. Always reset both to `1` after a kernel resize call.

### 5. `GetGivSvg` is NOT consumed — it is a plain lookup
`GetGivSvg(index)` returns `_capturedGivs[givIndex].SvgContent`. It does not clear anything. Call it as many times as needed.

### 6. Transform-only path leaves SVG stale
When `AnimateTransformItem` does not trigger `RenderOpen`/`RenderClose`, `GetUpdatedCapturedGivFromTransform` is used. It returns the cached (pre-manipulation) `SvgContent` with only `X`/`Y`/`Angle` metadata updated. `GivDrawingContext.refreshSvg()` is a stub — completing it is an open implementation gap.

### 7. `detectAndCreateGroups` is always a no-op
`GivInfo.groupId` is never populated from the layout JSON. The `detectAndCreateGroups` call in `GivManager.ts` produces zero `fabric.Group` objects at runtime. See the GIV Grouping section.

### 8. `CollectDirectSubItems` depth guard
Sub-item collection stops at `depth > 4`. `ElementInstance` chains deeper than 4 levels are silently excluded from the tree panel.

### 9. Registry and metadata must be cleared in sync
`canvas.clear()`, `clearGivMetadata()`, and `registry.clear()` must always be called together before a reload. Stale registry entries cause wrong `notifySelected` callbacks.

---

## Reference Files

- `FabricWasmHost/SvgDrawingAdapter.cs` — visual tree hooks, composite SVG, `VisualState`, `CapturedGiv`, `GetTreeNodes`
- `FabricWasmHost/FabricDisplayBoot.cs` — WASM `[JSExport]` entry points; `_capturedGivs`; `SerializeGivInfo`; `BuildLayoutJson`
- `GraphicsEditor.FabricJS/src/bridge/types.ts` — authoritative `GivInfo`, `GivProperty`, `FabricWasmApi` contracts
- `GraphicsEditor.FabricJS/src/canvas/FabricCanvasView.tsx` — canvas React component; event wiring
- `GraphicsEditor.FabricJS/src/giv/GivManager.ts` — `loadGivsOntoCanvas`, `detectAndCreateGroups` (not yet wired)

---

## Verification Checklist

Before considering an implementation complete:

- [ ] Each root GIV (`parentIndex === -1`) maps to exactly one FabricJS object
- [ ] Sub-items (`depth ≥ 1`) are shown in the tree-view panel only — not added to canvas
- [ ] GIVs render at kernel-specified `x/y/width/height` with no additional scaling
- [ ] Moving a GIV calls `ctx.move(dx, dy)` → `bridge.moveGiv()` → `_applyKernelInfo()` with returned GivInfo
- [ ] Resizing a GIV calls `ctx.resize(newW, newH)`, resets `scaleX/scaleY = 1`, applies returned GivInfo
- [ ] Rotating a GIV calls `ctx.rotate(angle)`, applies returned GivInfo
- [ ] After move/resize/rotate, FabricJS object position exactly matches returned GivInfo
- [ ] Drag-and-drop from toolbox calls `bridge.createGiv()` (not a local SVG stub)
- [ ] Clicking a GIV fires `ctx.notifySelected()` → properties panel updates
- [ ] Canvas `backgroundColor` is `'transparent'` in the Canvas constructor
- [ ] Colours are rendered as `rgb(R,G,B)` + `fill-opacity: A/255` — no sentinel substitution
- [ ] `objectCaching: false` is set on any custom FabricJS GIV class
- [ ] `originX: 'left', originY: 'top'` is set on all kernel-bound FabricJS objects
- [ ] `clearGivMetadata()`, `registry.clear()`, and `canvas.clear()` are called together on reload
- [ ] All 5 E2E tests in `e2e/graphics-rendering.spec.ts` pass after any change
