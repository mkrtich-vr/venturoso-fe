# venturoso-fe

React + TypeScript + Vite frontend, organised with **Feature-Sliced Design**.

The starter is wired end to end — routing, a real data layer, a themeable design
system and tests — with working examples of each convention rather than empty
scaffolding. Example data comes from the public [dummyjson.com](https://dummyjson.com)
API; swap `VITE_API_URL` when the real backend exists.

## Stack

| Concern      | Choice                                                           |
| ------------ | ---------------------------------------------------------------- |
| Build        | Vite 8 · React 19 · TypeScript 6                                 |
| Architecture | Feature-Sliced Design v2.1 (+ Steiger linter)                    |
| Routing      | React Router 8 — **Data mode** (`createBrowserRouter`)           |
| Server state | TanStack Query 5                                                 |
| Client state | Zustand 5                                                        |
| UI           | shadcn (**Base UI** primitives) + Tailwind v4                    |
| Quality      | ESLint 10 (type-aware) · Prettier 3 · Vitest 5 + Testing Library |

> TypeScript is pinned to `~6.0.3` on purpose. typescript-eslint 8.x declares
> peer support for `typescript >=4.8.4 <6.1.0`, so moving to TS 7 would force
> every type-aware lint rule to be switched off.

## Prerequisites

Node **≥ 22.12** (Vitest 5 requires it). This project is developed on Node 24 via
nvm:

```bash
nvm use 24
```

If `node` is not found in a non-interactive shell, nvm has not been sourced —
either run the command through a login shell or prepend the version's bin
directory to `PATH`.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Script                            | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `npm run dev`                     | Vite dev server                            |
| `npm run build`                   | Typecheck (`tsc -b`) then production build |
| `npm run preview`                 | Serve the production build locally         |
| `npm run typecheck`               | TypeScript only, no emit                   |
| `npm run lint`                    | ESLint, including type-aware rules         |
| `npm run lint:fix`                | ESLint with autofix                        |
| `npm run lint:fsd`                | Steiger — validates the FSD structure      |
| `npm run format` / `format:check` | Prettier                                   |
| `npm test`                        | Vitest (watch)                             |
| `npm run test:run`                | Vitest once                                |
| `npm run test:coverage`           | Vitest with V8 coverage                    |

## Architecture

Only three layers exist today — `app`, `pages`, `shared`. FSD v2.1 says to start
minimal and extract only when something is genuinely reused, so `entities/` and
`features/` are deliberately absent until they earn their place. (`widgets/` is
discouraged in v2.1 entirely.)

```
src/
  app/        Providers, routing, global styles — the composition root
  pages/      Route-level slices; page-specific UI and queries live here
  shared/     Infrastructure with no business logic: UI kit, API client, utils
```

**Import direction is strictly downward: `app → pages → shared`.** Same-layer
cross-imports are forbidden. This is enforced twice — Steiger checks the
structure, and ESLint `no-restricted-imports` catches a wrong direction inline
while you type.

**Public API.** Each `pages/*` slice exposes exactly one `index.ts`; importing
past it is a violation. The `shared` layer has no slices, so it gets one barrel
_per segment_ (`shared/api`, `shared/ui`, `shared/lib`, …) rather than a single
`shared/index.ts`.

**Filenames are domain-based** — `format-price.ts`, `product.queries.ts`, never
`utils.ts` / `types.ts` / `helpers.ts`. Steiger enforces the same rule for
segment names, which is why the app layer uses flat purpose-named files instead
of `providers/` or `ui/` folders.

### Path aliases

One alias per layer (`@/app`, `@/pages`, `@/shared`), declared once in
`tsconfig.app.json`. Vite 8 reads them directly via `resolve.tsconfigPaths`, so
the bundler and TypeScript cannot drift apart. They are mirrored into the root
`tsconfig.json` purely because the shadcn CLI resolves aliases from there.

### State boundary

- **TanStack Query owns all server state.** Query definitions live in
  `shared/api/<resource>/*.queries.ts` as `queryOptions` factories with
  hierarchical `as const` keys, so a prefix invalidates everything beneath it.
  Mutations live next to their point of use (`pages/*/api/use-*.ts`).
- **Zustand owns client state** — the theme store in `shared/theme` is the
  worked example. Never cache API responses there.

React Router deliberately uses **no `loader`/`action`**: with Query owning
fetching, route loaders would double-fetch and fight the query cache. Routes are
code-split with `lazy`.

### Theming

Design tokens are defined once in `src/app/styles/global.css`: raw values under
`:root` / `.dark`, then registered with Tailwind in `@theme inline` as
`--color-<name>: var(--<name>)`. Four project tokens sit on top of the shadcn
palette — `brand`, `success`, `warning`, `surface-raised`.

Because light and dark define the same token names, components never need manual
`dark:` colour overrides. Use semantic utilities (`bg-brand`,
`text-success-foreground`), never literals like `bg-blue-500`.

> shadcn is configured with **Base UI**, not Radix. The APIs differ: custom
> triggers use `render={<Link />}` rather than `asChild`, and rendering a Button
> as a non-button element additionally requires `nativeButton={false}`.

## Conventions

Coding rules for both humans and AI assistants live in [CLAUDE.md](./CLAUDE.md).
