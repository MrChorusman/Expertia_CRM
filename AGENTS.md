# AGENTS.md

## Cursor Cloud specific instructions

### What this repo actually is
This repository is the **legacy production Expertia CRM app**: a single-file React SPA
(`index.html`, ~1.2 MB) transpiled in-browser via Babel Standalone, wrapped by Electron
(`main.js`) for desktop and served statically on the web. It talks directly to **real
production Firebase** (project `expertiacrm-7e7eb`; config baked into `firebase-config.js`).

Note: the root `CLAUDE.md` describes a *future* Next.js/Supabase rewrite. That rewrite does
**not** exist in this repo — do not assume Next.js/Supabase/TanStack/etc. are present here.

### How to run (dev)
- Web (recommended in cloud): `node server.js` → serves `index.html` at http://localhost:3000.
  There is no build step and no bundler; the browser compiles the inline `text/babel` script.
- Desktop: `npm start` runs Electron — needs a display, so it is not suitable for headless runs.
- First load takes ~30–60s: the "Cargando Expertia Business Suite…" screen stays up until Babel
  finishes compiling the large inline script and React mounts. This is normal, not a hang.
- External CDNs (unpkg, gstatic, cdnjs, tailwind) must be reachable; network egress is required.

### Critical caveat: pin Babel Standalone to 7.x
`index.html` loads `@babel/standalone`. It must stay pinned to a **Babel 7.x** version
(currently `@7.28.0`). The unpinned/`latest` URL now resolves to Babel 8, whose `preset-react`
defaults to the *automatic* JSX runtime and emits `import { jsx } from "react/jsx-runtime"` into
the compiled output. Because that output is re-injected as a classic (non-module) `<script>`,
the browser throws `Cannot use import statement outside a module` and the app is stuck forever on
the loading screen. Babel 7.x keeps the classic runtime (`React.createElement`), which this app
requires. Do not revert this pin to an unversioned URL.

### Lint / tests / build
- No lint or automated test setup exists (no ESLint, Vitest, Jest, or Playwright configured).
  The many `test-*.js` / `debug-*.js` files are ad-hoc manual scripts, not a test suite.
- "Build" here means Electron packaging (`npm run build` / `electron-builder`), not a web build.

### Working against production Firebase (be careful)
- Auth/Firestore writes hit the client's **live** database. Do **not** create, edit, or delete
  real business records (clients, offers, invoices, etc.) during testing.
- New sign-ups via "Crear cuenta ahora" create a real Firebase Auth user + `users/{uid}` doc.
  A verified test account reaches the full CRM dashboard.
- Per `CLAUDE.md`, store QA test credentials only in the git-ignored `.local/test-users.json`
  (never commit passwords).
