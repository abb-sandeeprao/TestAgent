---
name: chmi-apux-screen
description: 'Generate a TypeScript React screen using APUX UI components and place it in the generations app. Use when: creating a new screen, generating a UI from a Storybook story, rendering APUX controls (button, input, card, dialog, accordion, menu, tree-view, tag, tooltip, select, status, etc.) inside generations/src/screens/. APUX components are registered as <apux-*> custom elements; React wrappers from apux-react are preferred. Always update App.tsx after creating a screen.'
argument-hint: '<screen-name> [source story path or feature description]'
---

# CHMI APUX Screen Generator

Generates a fully wired TypeScript React screen that uses **APUX UI components**, places it at the **canonical path** `generations/src/screens/<screen-name>.tsx`, and wires it into `generations/src/App.tsx`.

## When to Use

- User asks to generate, scaffold, or create a screen in the `generations` app
- User references a Storybook story from `packages/apux-storybook/stories/`
- User wants to prototype a UI using APUX controls
- User asks to render any of: button, card, input, dialog, accordion/details, menu, tree-view, tag, tooltip, select, status, switch, toggle-button, tab, breadcrumb, icon, field, textarea, checkbox, radio

## Pre-flight Checks

Before writing any code:
1. Read the relevant story file(s) under `packages/apux-storybook/stories/<component>/` — these define canonical tags, slots, and args
2. Check `packages/apux-react/src/index.ts` to confirm a React wrapper exists (prefer wrapper over raw web-component tag)
3. Confirm the project uses only the official APUX packages: `@abb-hmi/apux` and `@abb-hmi/apux-jsx`. Do not create or import any custom APUX packages, custom attributes, or new custom elements — rely only on the components and attributes exposed by the official packages.
4. Read `generations/src/App.tsx` to confirm the current route list before adding a new route
5. Check `generations/src/main.tsx` — confirm `import '../../packages/apux/src/index-dev'` is present (registers `<apux-*>` custom elements)

## APUX Package Policy

- Use only `@abb-hmi/apux` and `@abb-hmi/apux-jsx` for APUX components and JSX wrappers when generating screens.
- Do not register custom APUX elements (avoid `customElements.define(...)`) or add undocumented/custom attributes to APUX components.
- Do not modify `packages/` source code to alter APUX behavior; rely on the official package exports.

### Runtime import rule

- Prefer using the registered web components `<apux-*>` directly in JSX at runtime.
- Avoid importing React wrapper modules from `@abb-hmi/apux` or `@abb-hmi/apux-jsx` at runtime unless a wrapper provides crucial runtime behavior not available via the web component.
- When only DOM typing is required (e.g., `ref` queries or `addEventListener` targets), use type-only imports to avoid runtime side-effects:

```ts
import type { ApuxButton } from '@abb-hmi/apux'
```

This import line is an example — replace `ApuxButton` with the actual type you need. This ensures no runtime code from APUX wrapper modules is pulled into the bundle accidentally.

## Procedure

### Step 1 — Create the Screen File

**Path**: `generations/src/screens/<screen-name>.tsx` (no sub-folders, flat)

Template structure (see [./assets/screen-template.tsx](./assets/screen-template.tsx)):

```tsx
import React from 'react';
// Prefer React wrappers when available:
import { Button, Input, Card } from '../../../packages/apux-react/src';
// For components without a wrapper, use the web-component tag directly in JSX

export const metadata = {
  sourceStory: 'packages/apux-storybook/stories/<component>/<story>.ts:<StoryName>',
  generatedAt: '<ISO date>',
  args: { /* mirror story args */ }
};

export default function <ScreenName>Screen() {
  return (
    <div style={{ padding: 16 }}>
      {/* Render using APUX components — see component catalogue */}
    </div>
  );
}
```

Rules:
- Export a **default** React component named `<ScreenName>Screen`
- Export a named `metadata` object with `sourceStory`, `generatedAt`, `args`
- `args` should mirror the Storybook story args used as data
- Only put files under `generations/src/` — **never** edit source packages

### Step 2 — Update `App.tsx`

Add three things to `generations/src/App.tsx`:
1. `const <ScreenName>Screen = React.lazy(() => import('./screens/<screen-name>'));`
2. `<Route path="/<screen-name>" element={<<ScreenName>Screen />} />`
3. `<li><Link to="/<screen-name>"><ScreenName></Link></li>` inside the home `<ul>`

### Step 3 — Verify Assets

If the screen needs icons or images, place them under `generations/src/assets/<screen-name>/` and import relatively.

### Step 4 — Run the Dev Server

```bash
cd generations && node ../node_modules/vite/bin/vite.js
# or from root:
yarn workspace generations-app start
```

Open `http://localhost:5173/<screen-name>` to verify.

## APUX Component Usage Rules

See the full catalogue in [./references/component-catalogue.md](./references/component-catalogue.md).

### Quick Reference

| React Wrapper | Web-component tag | Import |
|---|---|---|
| `Button` | `<apux-button>` | `apux-react/src/components/button` |
| `Input` | `<apux-input>` | `apux-react/src/components/input` |
| `Card` | `<apux-card>` | `apux-react/src/components/card` |
| `Dialog` | `<apux-dialog>` | `apux-react/src/components/dialog` |
| `Accordion` | `<apux-accordion>` | `apux-react/src/components/accordion` |
| `Details` | `<apux-details>` | `apux-react/src/components/details` |
| `Select` / `Option` | `<apux-select>` / `<apux-option>` | `apux-react/src/components/select` |
| `Tooltip` | `<apux-tooltip>` | `apux-react/src/components/tooltip` |
| `Tag` | `<apux-tag>` | `apux-react/src/components/tag` |
| `Status` | `<apux-status>` | `apux-react/src/components/status` |
| `Icon` | `<apux-icon>` | `apux-react/src/components/icon` |
| `ToggleButton` | `<apux-toggle-button>` | `apux-react/src/components/toggle-button` |
| `Switch` | `<apux-switch>` | `apux-react/src/components/switch` |
| `Checkbox` | `<apux-checkbox>` | `apux-react/src/components/checkbox` |
| `Radio` | `<apux-radio>` | `apux-react/src/components/radio` |
| `Textarea` | `<apux-textarea>` | `apux-react/src/components/textarea` |
| `TreeView` | `<apux-tree-view>` | `apux-react/src/components/tree-view` |
| `Tab` / `TabList` | `<apux-tab>` / `<apux-tab-list>` | `apux-react/src/components/tab` |
| `Breadcrumb` / `Breadcrumbs` | `<apux-breadcrumb>` | `apux-react/src/components/breadcrumb` |
| `Field` | `<apux-field>` | `apux-react/src/components/field` |
| — | `<apux-menu>` / `<apux-menu-item>` | web-component only (no React wrapper) |

**Components without a React wrapper** (use tag directly in JSX):
- `<apux-menu>`, `<apux-menu-item>`, `<apux-menu-header>`, `<apux-divider>`
- Attach events via `ref` + `useEffect` / `addEventListener`

Important: Use only the components, wrappers, and attributes exported by the official packages `@abb-hmi/apux` and `@abb-hmi/apux-jsx`.
- Do not define or register new custom elements that duplicate or extend APUX components (avoid `customElements.define(...)`).
- Do not introduce undocumented or custom attributes on APUX components; use only the attributes provided by the official packages.
- Prefer React wrappers from `@abb-hmi/apux-jsx` when available; otherwise use the registered web components supplied by `@abb-hmi/apux`.

### Custom Events Pattern (no React wrapper)

```tsx
import React, { useRef, useEffect } from 'react';

export default function MyScreen() {
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const handler = (e: Event) => console.log('selected', e);
    el.addEventListener('apux-select', handler);
    return () => el.removeEventListener('apux-select', handler);
  }, []);

  return (
    <apux-menu ref={menuRef as any}>
      <apux-menu-item>Item One</apux-menu-item>
      <apux-menu-item>Item Two</apux-menu-item>
    </apux-menu>
  );
}
```

## Quality Checklist

Before finishing, confirm:
- [ ] File is at `generations/src/screens/<screen-name>.tsx`
- [ ] Default export is a React component
- [ ] Named export `metadata` has `sourceStory`, `generatedAt`, `args`
- [ ] APUX React wrappers used (or web-component tags when no wrapper exists)
- [ ] `App.tsx` updated: lazy import + Route + Link on home page
- [ ] `main.tsx` has `import '../../packages/apux/src/index-dev'`
- [ ] No edits made to `packages/` source code
- [ ] Only use `@abb-hmi/apux` and `@abb-hmi/apux-jsx` for APUX components and JSX wrappers
- [ ] No custom attributes or custom elements introduced
