# Project Guidelines

## Build and Test
- Install dependencies with `npm install`.
- Start development with `npm run dev`.
- Build production assets with `npm run build`.
- Preview production build with `npm run preview`.
- No test or lint scripts are currently defined in `package.json`; do not assume `npm test` or `npm run lint` exists.

## Architecture
- This repository contains two apps:
  - React editor app at `src/` (main app at `/`).
  - Fabric canvas app at `fabric-canvas.html`.
- React app boundaries:
  - `src/App.jsx` owns `elements` state and add/update/delete handlers.
  - `src/components/Toolbox.jsx` loads tools from `public/palette-config.json`.
  - `src/components/Editor.jsx` handles rendering, selection, drag/drop, and edit interactions.

## Conventions
- Use React function components and hooks, matching existing `.jsx` style.
- Prefer plain CSS files for styling (`src/*.css`, `src/components/*.css`), not Tailwind or CSS-in-JS.
- Keep toolbox behavior config-driven via `public/palette-config.json`.
- When adding new editor element types, update both `public/palette-config.json` and render logic in `src/components/Editor.jsx`.

## APUX Integration
- UI uses APUX web components and currently loads the mock script from `public/apux-mock.js` via `index.html`.
- Preserve script loading order in `index.html`: APUX script must load before React app startup.
- Web component events can provide values through `e.detail`; keep handlers compatible with both `e.target.value` and `e.detail` patterns.
- Styling web components may require targeted overrides in CSS.

## Practical Notes
- For toolbox regressions, check `public/palette-config.json` and icon paths under `public/icons/` first.
- For drag/drop regressions, check `src/components/Editor.jsx` mouse handlers and element `style.left`/`style.top` updates.
- For APUX migration details and troubleshooting, refer to `APUX_INTEGRATION.md`.