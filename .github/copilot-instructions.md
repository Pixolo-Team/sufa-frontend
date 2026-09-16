---
applyTo: "**"
priority: 1
---

# Skorost United (SUFA) Frontend - Copilot Instructions

## Project Overview

This is the marketing and operations site for Skorost United Football Academy, built with
Astro 5.5.3 and SCSS Modules, with React islands for interactive components. The project lives at
`apps/frontend/` in this repository and is deployed to Vercel.

**App root:** `apps/frontend/`
**Framework:** Astro (static + a few dynamic routes) with `@astrojs/react` for interactive islands
**Styling:** SCSS Modules (`*.module.scss`) — no Tailwind
**Backend:** Supabase (`@supabase/supabase-js`) for the operations area, plus a small internal API
client under `src/services/api`
**Node package manager:** npm

## Global Engineering & Code Quality Rules

### 📌 Import Rules

- All imports must use the `@` alias (maps to `apps/frontend/src/*`), never relative paths like
  `../../`.
- Group imports under a comment header matching the category, one blank line between groups, in
  this order when applicable: `// REACT //`, `// TYPES //`, `// ENUMS //`, `// STYLES //`,
  `// COMPONENTS //`, `// API SERVICES //`, `// SERVICES //`, `// UTILS //`. Follow the existing
  pattern in [Header.astro](../apps/frontend/src/components/header/Header.astro) and
  [EnquireForm.tsx](../apps/frontend/src/components/enquiry-form/EnquireForm.tsx).

### 📁 File Naming Rules

- All filenames **must be kebab-case** (e.g. `fee-calculator.util.ts`, `enquiry-form/`).
- UI components (`.astro`, `.tsx`) **may be PascalCase** (e.g. `Header.astro`, `Button.tsx`), but
  their containing folder stays kebab-case.
- File names must be correctly **singular or plural**, depending on purpose.
- Non-component TypeScript files must include a suffix describing purpose:
  - `*.util.ts` — pure helper functions (see `src/utils/`)
  - `*.service.ts` — side-effecting logic / API or third-party wrappers (see `src/services/`)
  - `*.api.service.ts` — HTTP calls to the backend (see `src/services/api/`)
  - `*.enum.ts` — enums (see `src/neevo/enums/`, `src/enums/`)

### 🧼 Clean Code

- Keep Astro components split: frontmatter logic, `*.module.scss` for styles, and imported
  helpers for anything non-trivial — don't inline large blocks of logic or CSS.
- Maintain clean spacing: leave intentional blank lines between conceptual blocks.
- Folders are structured by feature/component under `src/components/`, `src/sections/`, and
  `src/neevo/` (the shared design system) — follow that placement when adding new UI.
- Use comments to explain **major steps**, non-obvious logic, and section boundaries — not what
  the code already says.
- Break HTML/JSX sections using comments (e.g. `{/* Header logo */}`); each comment must have
  **one empty line above it**.

### 📌 Naming Conventions

- Never use vague names like `status`, `message`, `data`. Use descriptive names such as
  `activeStatus`, `errorPopup`, `finalResponseData`.
- All **types & interfaces** must be PascalCase and end with `Data`
  (e.g. `HeaderListData`, `DropdownOptionData`, `RegistrationStatusData`).
- Normal variables must be camelCase.

### 🎯 Decision Rules

- Variable names should be **singular** unless representing a list.
- Use **JPG** for photographic images; use **PNG/SVG** when transparency is required (icons use
  SVG via `InlineSvg`/`astro-icon`-style components).

### 🧠 Map Iteration Rules

When using `.map()` in UI code, the iterated variable must have plural list name + `Item`:

```ts
headerListItems.map((headerListItem, headerListItemIndex) => ...)
```

### 🧩 Function Definition Rule

All functions must follow this exact arrow-function format:

```ts
const functionName = () => {
  // logic
};
```

## Build & Development Workflow

All commands run from `apps/frontend/`.

### Initial Setup

```bash
cd apps/frontend
npm install
```

Set up environment variables in a `.env` file (Supabase URL/key and any API base URL used by
`src/services`) before running the app — the operations pages and enquiry form will fail without
them.

### Available Commands

1. **Development Server**

   ```bash
   npm run dev
   ```

   Starts the Astro dev server on http://localhost:4321.

2. **Type Check**

   ```bash
   npm run check
   ```

   Runs `astro check` across every `.astro`, `.ts`, and `.tsx` file. Unlike a bare Astro starter,
   `@astrojs/check` **is** installed here — always run this after non-trivial changes.

3. **Production Build**

   ```bash
   npm run build
   ```

   Outputs to `dist/` (Vercel adapter target).

4. **Preview Built Site**

   ```bash
   npm run preview
   ```

5. **Astro CLI**

   ```bash
   npm run astro
   ```

### Formatting

The repo root has a `.prettierrc` (tabs, double-width-1, `prettier-plugin-astro` for `.astro`
files). Run Prettier through your editor or `npx prettier --write <file>` — there is no dedicated
npm script for it.

### Build Validation

After making code changes:

1. Run `npm run check` to catch type errors (this project has strict checking wired up, unlike a
   bare Astro template).
2. Run `npm run build` to verify the production build succeeds.
3. Check for new warnings/errors beyond expected output.

## Project Architecture

### Directory Structure (`apps/frontend/`)

```
apps/frontend/
├── public/                 # Static assets (fonts, icons, images) copied to dist/
├── src/
│   ├── components/         # Shared UI components, one folder per component
│   ├── data/                # Static data files
│   ├── enums/                # App-level enums
│   ├── infrastructure/     # Cross-cutting setup (e.g. clients, config)
│   ├── layouts/             # BaseLayout — <head>, header, footer, smooth scroll
│   ├── neevo/               # Reusable internal design system (components/enums/services/types/utils)
│   ├── pages/                # File-based routes, incl. pages/operations, pages/registrations
│   ├── scripts/              # Client-side behaviour shared across components
│   ├── sections/home/       # One file per section of the marketing one-pager
│   ├── services/             # Supabase client, internal services, services/api for HTTP calls
│   ├── styles/                # Global SCSS, design tokens (styles/tokens), page-level modules
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # Pure helper functions
├── astro.config.mjs
├── tsconfig.json             # extends astro/tsconfigs/strict, @ alias → ./src/*
└── package.json
```

### Key Configuration Files

**astro.config.mjs:**

- `site`: `https://academy.skorostunited.com`
- `adapter`: `@astrojs/vercel` — most pages are prerendered; the registration tracker route opts
  out with `export const prerender = false`
- `integrations`: `@astrojs/react`, scoped to `**/*.tsx` — React is only for interactive islands
  (e.g. the enquiry form), not the default authoring mode
- Vite SCSS `silenceDeprecations` set for the legacy `@import` syntax

**tsconfig.json:**

- Extends `astro/tsconfigs/strict`
- `@/*` → `./src/*` alias already configured — always use it
- `jsx: react-jsx`, `jsxImportSource: react`

**package.json:**

- Name: `@skorost/frontend`
- Scripts: `dev`, `build`, `preview`, `check`, `astro` — no lint/test scripts configured

### Styling System

**SCSS Modules** — colocated `<component-name>.module.scss` files imported as `styles` and
referenced via `styles.className`. No Tailwind/utility-class framework in this app.

- Global styles and tokens live in `src/styles/` (`styles/tokens/` for design tokens,
  `styles/pages/` for page-level overrides).
- Utility classes like `flex`, `justify-between`, `align-center` are used alongside module classes
  where already established — match the existing pattern in a file rather than introducing a new
  system.

### Component Patterns

**Astro Components** (`.astro` files):

- `---` frontmatter for imports/logic, grouped by comment headers (see Import Rules above).
- Types via `interface`/`type` imported from `src/types` or `src/neevo/types`, named `...Data`.
- Components live in `src/components/<component-name>/ComponentName.astro`, sections in
  `src/sections/home/`, and the shared design system in `src/neevo/components/`.

**React islands** (`.tsx` files):

- Only used where interactivity is required (e.g. `enquiry-form/EnquireForm.tsx`). Default to
  `.astro` unless the component needs client-side state/events.
- Hydration directives (`client:load`, `client:visible`, etc.) should be as narrow as possible —
  don't hydrate a whole section when only a sub-component is interactive.

**Data-driven rendering:**

- Static data in `src/data/`, enums in `src/enums/` and `src/neevo/enums/`.
- Iterate with `.map()` following the Map Iteration Rule above.

**Image handling:**

- Reference public images with absolute paths (`/images/...`).
- Use Astro's `Image`/`Picture` from `astro:assets` where images are processed at build time;
  include width/height and `loading="lazy"`/`decoding="async"` for below-the-fold images.

**Services:**

- `src/services/supabase.client.ts` — Supabase client used by the operations pages.
- `src/services/api/*.api.service.ts` — HTTP calls to the internal API (leads, registration
  status). Follow the `*.api.service.ts` naming and the existing `// API SERVICES //` import
  grouping when adding new calls.
- `src/utils/*.util.ts` — pure helpers (fee calculation, date formatting, validation, etc.).

### Routing

File-based routing via `src/pages/`, including nested routes:

- `pages/operations/` — internal operations tooling (batches, fees, sharing), wired to Supabase.
- `pages/registrations/[taskId]` — dynamic registration tracker route (`prerender = false`).

## Making Code Changes

### Recommended Workflow

1. Review existing patterns in a similar file before writing new code (naming, import grouping,
   SCSS module usage).
2. Make minimal, scoped changes.
3. Run `npm run check` and `npm run build` from `apps/frontend/` to verify.
4. For visual changes, run `npm run dev` and check the affected breakpoints.
5. Confirm no new console errors and that light/dark behaviour (if applicable) still holds.

### Common Change Types

**Adding a new page:**

1. Create a new `.astro` file under `src/pages/` (or a subfolder for nested routes).
2. Import and wrap content in the shared layout from `src/layouts/`.
3. Run `npm run check` and `npm run build` to verify routing.

**Adding a new component:**

1. Create `<component-name>/ComponentName.astro` (or `.tsx` only if interactive) under
   `src/components/` or `src/neevo/components/` for shared/design-system pieces.
2. Add a colocated `<component-name>.module.scss` for styles.
3. Define any props as a `...Data`-suffixed type in `src/types/` (or `src/neevo/types/`).
4. Follow the import-grouping and naming conventions above.

**Adding styles:**

1. Prefer a colocated `*.module.scss` file over inline styles.
2. Use existing design tokens from `src/styles/tokens/` rather than hardcoded values.
3. For global styles, add to `src/styles/` (global entry point).

**Adding static assets:**

1. Place in `apps/frontend/public/` (fonts, images, icons, videos).
2. Reference with absolute paths: `/images/name.jpg`.
3. Files are copied as-is to `dist/` during build.

### TypeScript Patterns

- `npm run check` performs real type checking here (`@astrojs/check` is installed) — treat type
  errors as build-blocking, not optional.
- Type annotations in frontmatter/props via `...Data`-suffixed interfaces.
- Enums live under `src/enums/` or `src/neevo/enums/` rather than string unions where a fixed set
  of values repeats across files.

### Dependencies

When adding dependencies:

1. Install from `apps/frontend/`: `npm install <package>`.
2. Check compatibility with Astro 5.x and, if it touches the client bundle, whether it needs a
   React island vs. plain Astro.
3. Update imports using the `@` alias.
4. Run `npm run check` and `npm run build` immediately after.

## Trust These Instructions

These reflect the actual conventions already present in `apps/frontend/src` (import grouping,
kebab-case + suffix file naming, `Data`-suffixed types, SCSS Modules, the `@` alias, and the real
npm scripts). Only search further if:

- These instructions are incomplete for your specific task.
- You encounter errors not documented here.
- You need to verify information that seems outdated.

When in doubt, run `npm run check` and `npm run build` from `apps/frontend/` first — they will
catch most issues immediately.
