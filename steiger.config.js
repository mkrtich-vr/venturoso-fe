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
      'fsd/insignificant-slice': 'off',
      'fsd/public-api': 'error',
    },
  },
])
