# SmartSprouts — Frontend

[![Live demo](https://img.shields.io/badge/demo-smartsprouts.pp.ua-2ea44f)](https://smartsprouts.pp.ua)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tests](https://img.shields.io/badge/tests-700%2B-brightgreen)

Frontend of **SmartSprouts** — a trilingual (EN/UK/ES) educational gaming platform that helps children build cognitive skills. This React 19 single-page app is the frontend of an early-stage startup MVP, built with production-grade fullstack engineering: a canvas game engine, centralized session handling, and a strict, fully-tested modular architecture.

- 🌐 **Live demo:** https://smartsprouts.pp.ua
- ⚙️ **Backend (Laravel API):** https://github.com/Roman-PRV/SmartSprouts-backend

---

## Tech Stack

| Layer            | Technology                                                                | Why                                                                    |
| ---------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Core**         | React 19 · TypeScript 5.8 · Vite 7                                        | Modern SPA, strict typing end-to-end, instant HMR                      |
| **State**        | Redux Toolkit 2.9 · React Redux 9                                         | Predictable state; the whole store resets on logout / session expiry   |
| **Routing**      | React Router 7.9                                                          | Guest / protected / admin route guards                                 |
| **Forms**        | React Hook Form 7 · Zod 4                                                 | Schema-first validation; field names mirror the API wire format        |
| **Canvas games** | Konva · react-konva · polygon-clipping                                    | Client-side polygon editor **and** area-IoU matching engine            |
| **i18n**         | i18next 25 (en/uk/es)                                                     | Trilingual UI with browser language detection                          |
| **Styling / UX** | TailwindCSS 4 · sonner · clsx                                             | Utility-first styling, unobtrusive toasts                              |
| **Testing**      | Vitest 3.2 · Testing Library                                              | 700+ tests (jsdom)                                                     |
| **Quality**      | ESLint 9 · Stylelint · Knip · Prettier · Husky · lint-staged · commitlint | Local pre-commit gate: lint, dead-code detection, Conventional Commits |

---

## Engineering Highlights

- **Canvas polygon-matching engine** — the _Find-the-Wrong_ game lets players draw closed polygons over an image; answers are scored client-side with a closed-loop check + area-IoU (not naive hit-tests) via `polygon-clipping`.
- **Centralized session handling** — a single 401 interceptor deauthenticates _any_ authenticated request through one seam, resetting the whole store and letting the router redirect to login — without the HTTP layer importing the store.
- **Strict modular architecture** — feature modules with barrel exports enforced by Knip (no dead exports leak out of a module).
- **Schema-first forms** — Zod schemas drive both validation and types; form field names equal the API wire names, so there is zero request/response mapping.
- **Trilingual from the ground up** — every user-facing string exists in EN/UK/ES, with structural-parity tests that fail if a translation drifts.

---

## Architecture / Folder Structure

```
src/
├─ app.tsx              # root layout: session bootstrap, route guards, providers
├─ main.tsx             # entry point
├─ assets/              # CSS design tokens, images
├─ games/               # game engines and registries
├─ libs/                # shared, cross-feature layer
│  ├─ components/       # reusable UI
│  ├─ hooks/            # hooks barrel (React + custom)
│  ├─ helpers/          # pure utilities
│  ├─ modules/          # api, store, http, storage, localization, config
│  └─ enums · types · constants · validation-schemas
├─ modules/             # feature modules: auth, admin, games, profile
└─ pages/               # route-level pages
```

The frontend has no database of its own — see the [backend repository](https://github.com/Roman-PRV/SmartSprouts-backend) for the data model and API.

---

## Getting Started

Requires **Node 22** (see `.nvmrc`).

```bash
git clone git@github.com:Roman-PRV/SmartSprouts-frontend.git
cd SmartSprouts-frontend
npm install
npm run dev
```

The dev server runs on port **3001**; requests to the API origin (`VITE_APP_API_ORIGIN_URL`) are proxied to `VITE_APP_PROXY_SERVER_URL`. For the backend, see the [companion repository](https://github.com/Roman-PRV/SmartSprouts-backend).

### Environment variables

```
VITE_APP_NODE_ENV
VITE_APP_DEVELOPMENT_PORT=3001
VITE_APP_API_ORIGIN_URL=http://localhost:3000/api
VITE_APP_PROXY_SERVER_URL=http://localhost:3002
```

---

## Scripts

- `dev` — start the Vite dev server.
- `build` — full TypeScript type check, then a production Vite build.
- `preview` — serve the production build locally.
- `lint` / `lint:ci` — ESLint over `src` (with / without `--fix`).
- `stylelint:ci` — Stylelint over CSS.
- `format` — Prettier over `.css` / `.md`.
- `typecheck` — `tsc --noEmit`.
- `check-config` — run `lint` + `typecheck` together (pre-commit / pre-build gate).
- `test` / `test:ci` / `test:watch` / `test:coverage` — Vitest.

---

## Development Flow

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0).

**Pull request title**

```
<type>: <ticket-title> <project-prefix>-<issue-number>
```

Example: `feat: add dashboard screen ss-123`

**Branch**

```
<issue-number>-<type>-<short-desc>
```

Examples: `123-feat-add-dashboard`, `34-fix-user-flow`

**Commit**

```
<type>: <description> <project-prefix>-<issue-number>
```

Examples: `feat: add dashboard component ss-45`, `fix: update dashboard card size ss-212`

---

## Contributors

- **Prokopenko Roman** — GitHub: [roman-prv](https://github.com/Roman-PRV), Discord: _@roman_27794_
