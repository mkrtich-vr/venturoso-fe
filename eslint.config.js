import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),

  js.configs.recommended,

  // Type-aware linting. This is what makes the config "strong" — rules such as
  // no-floating-promises and no-misused-promises need real type information.
  // It is also why TypeScript is pinned below 6.1: typescript-eslint 8.x
  // declares peer support for `typescript >=4.8.4 <6.1.0`.
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          // eslint.config.js and steiger.config.ts are outside every tsconfig
          // `include`, so the project service needs explicit permission.
          // vite.config.ts is NOT listed: tsconfig.node.json already covers it,
          // and listing it in both places is an error.
          allowDefaultProject: ['eslint.config.js', 'steiger.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // v7 keeps the flat-config variants under `configs.flat`; the top-level
  // `configs['recommended-latest']` is still the legacy eslintrc shape.
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,

  {
    rules: {
      // Allow a deliberate `void promise` to mark a floating promise as intended.
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      // Underscore prefix is the conventional opt-out for genuinely unused args.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // ---------------------------------------------------------------------
  // Feature-Sliced Design import direction: app -> pages -> shared.
  // Steiger validates project *structure*; these rules catch a wrong import
  // direction inline in the editor, which is where it actually helps.
  // ---------------------------------------------------------------------
  {
    files: ['src/pages/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*'],
              message:
                'FSD: pages must not import from app. Imports only travel downward (app -> pages -> shared).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*', '@/pages', '@/pages/*'],
              message:
                'FSD: shared is the lowest layer and must not import from any layer above it.',
            },
          ],
        },
      ],
    },
  },

  // shadcn components are vendored third-party source. Hold our own code to the
  // full ruleset, but do not fight generated files over stylistic preferences.
  {
    files: ['src/shared/ui/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'vitest.setup.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  // Root config files: several ESLint/Steiger plugins ship no type declarations,
  // so their exported configs surface as `any` and trip the unsafe-* rules.
  // These files are build tooling, not application code.
  {
    files: ['*.config.ts', '*.config.js'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // Must stay last: switches off every rule that would fight Prettier.
  prettier,
])
