# CLAUDE.md

> **Status**: pending placement. This repo will hold a React + Vite app
> (Feature-Sliced Design). The app hasn't been scaffolded yet — once it is,
> move/merge this file's content into its final location and adjust as the
> project's actual conventions settle. Until then, treat everything below as
> the baseline AI rules for this codebase.

Abstract, project-agnostic baseline for React work here — not tied to specific
features. Built to sit on top of **Feature-Sliced Design** and the Claude Code
skills already installed (`feature-sliced-design`, `vercel-composition-patterns`,
`vercel-react-best-practices`, `shadcn`, `typescript-expert`,
`tanstack-query-best-practices`). This file is the glue between them, not a
replacement — where a rule below is covered in more depth by one of those
skills, it points there instead of repeating it. Extend this over time with
real project/team conventions as they emerge.

## 1. Structure

- **Architecture**: use Feature-Sliced Design for layers/slices/segments — see
  the `feature-sliced-design` skill for the full decision tree.
- **One component per file.** Filename matches the exported component
  (PascalCase), e.g. `ProductCard.tsx` exports `ProductCard`. A small,
  tightly-coupled subcomponent used only by its parent may stay in the same
  file; anything reused or non-trivial gets its own file.
- **Keep files short — split once a file passes ~200 lines.** Treat this as a
  team-adjustable default, not a law: ESLint's own `max-lines` rule defaults to
  300, and reputable guidance ranges 100–500 depending on the codebase. Start
  at 200 and tune it. Apply the same instinct to functions — a function past
  ~50 lines is a hint it's doing more than one job.
- **Colocate everything related to a piece of code next to it** — subcomponents,
  hooks, tests, styles. This is also what FSD's segments (`ui/`, `model/`,
  `api/`, `lib/`) already give you inside a slice; the rule just extends the
  same instinct to page-local code.
- **Keep nesting shallow.** If you're several directories deep and still not at
  a leaf, that's usually a sign something should be promoted to its own
  slice/segment rather than nested further.

## 2. Naming & Imports

- **Components**: PascalCase, filename matches the export.
- **Hooks**: camelCase, must start with `use` — this isn't style, React's own
  rules-of-hooks linting depends on the prefix to recognize it as a hook.
- **Everything else (model/api/lib files): domain-based names, never
  technical-role names** (`types.ts`, `utils.ts`, `helpers.ts`) — this is FSD
  rule 4-4; apply it project-wide, not just inside FSD slices.
- **Prefer named exports over default exports.** Named exports keep the
  imported identifier tied to the source, which makes TypeScript
  rename/refactor/auto-import reliable — default exports let every importer
  invent its own name for the same thing. It's also what FSD's own public-API
  examples use throughout (`import { LoginForm } from "@/features/auth"`).
- **No internal barrel files.** Import directly from the file that defines
  something, not from a convenience `index.ts` grab-bag inside `ui/`, `hooks/`,
  etc. — barrels force bundlers to evaluate everything they re-export, which
  measurably slows dev servers and can cause circular-import breakage (see
  `vercel-react-best-practices` → `bundle-barrel-imports`). **The one
  exception is FSD's own required slice-level `index.ts` Public API** — that's
  a single, deliberate boundary per slice, not a general-purpose barrel, and
  it's the reason FSD's import rules work at all.
- **Use path aliases (`@/...`)** instead of long relative `../../../` chains —
  already implied by FSD's own examples.

## 3. Components & Hooks

- **A component should do one thing.** When it's doing two, split it into two
  components and compose them.
- **Extract a custom hook when you're wrapping a `useEffect`** (or another
  escape-hatch) and the calling code would read more clearly without the
  synchronization details inline — not just to deduplicate a few lines with no
  real shared behavior.
- **A custom hook should have a narrow, named purpose** (`useChatRoom(roomId)`),
  not be a generic lifecycle wrapper (`useMount`, `useUpdateEffect`) that just
  renames React's own API.
- **Favor composition over prop drilling; reach for Context only once
  composition genuinely doesn't work.** For the deeper patterns here
  (compound components, avoiding boolean-prop proliferation, explicit
  variants), see the `vercel-composition-patterns` skill — don't duplicate it
  here.
- **Skip the container/presentational split.** Hooks already separate stateful
  logic from rendering without it — the pattern's own creator (Dan Abramov)
  retracted it in 2019 for exactly this reason.
- **Keep state as close as possible to where it's used; lift it only when a
  sibling genuinely needs it.** This is the same instinct as FSD's "start in
  pages, extract only when something is actually shared" philosophy — apply it
  to state, not just file placement.
- **When a component's state updates are spread across many handlers and hard
  to follow, consolidate with `useReducer`.** Optional — don't force it on
  simple state.

## 4. Quality Baseline

- **Test behavior, not internals**: render the component, query by
  role/label/text, interact via click/type — don't assert on internal state or
  implementation details. Colocate the test file with the component it tests.
- **Semantic HTML first.** Reach for ARIA only when no native element
  expresses the needed role. Every meaningful `<img>` needs `alt`; every input
  needs an associated `<label>`.
- **Never use array index as a list `key`** for a list that can reorder,
  filter, or have items inserted/deleted — use a stable ID from the data
  itself. This is an identity-correctness issue, not just a perf one.
- **Wrap logical sections — not every component — in an error boundary**, so
  one broken part of the tree shows a scoped fallback instead of blanking the
  whole page.

## Extending this doc

This is intentionally a starting baseline, not exhaustive. Natural next
additions as the project grows: state-management-library conventions beyond
TanStack Query, form-handling conventions, styling conventions (if not using
shadcn's defaults), CI/lint enforcement for the rules above (e.g. wiring
`max-lines`, `react/no-multi-comp`, `react/no-array-index-key` into ESLint so
these stop being just documentation).

## Sources

- react.dev — Reusing Logic with Custom Hooks, Thinking in React, Extracting
  State Logic into a Reducer, Sharing State Between Components, Passing Data
  Deeply with Context, Rendering Lists, Error Boundaries
- Airbnb React/JSX Style Guide (github.com/airbnb/javascript/tree/master/react)
- ESLint — `max-lines`, `max-lines-per-function`; eslint-plugin-react —
  `no-multi-comp`, `no-array-index-key`
- Kent C. Dodds — Colocation; State Colocation will make your React app faster
- TkDodo — Please Stop Using Barrel Files
- Dan Abramov — Presentational and Container Components (2019 update note)
- Testing Library — Guiding Principles
- web.dev — Labels and text alternatives
- bulletproof-react — Project Standards
- `vercel-react-best-practices` skill (already installed) —
  `bundle-barrel-imports` rule
- `feature-sliced-design` skill (already installed) — rule 4-4 domain-based
  naming, Public API pattern, "start simple, extract when needed" philosophy
