import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ['**/*.test.ts', '**/*.test.tsx'],
  },
  {
    files: ['./src/**'],
    rules: {
      // Every slice currently has exactly one consumer, which is expected for a
      // fresh project — FSD's own guidance is "start in pages, extract later".
      // Re-enable this once slices are genuinely shared.
      'fsd/insignificant-slice': 'off',
      // The public-API rule wants an index.ts per shared segment rather than a
      // single shared/index.ts; that is what this project does.
      'fsd/public-api': 'error',
    },
  },
])
