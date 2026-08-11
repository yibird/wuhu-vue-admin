import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 80,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'coverage/**',
    '.agents/**',
    '.claude/**',
    'auto-imports.d.ts',
    'components.d.ts',
    '*.timestamp-*.mjs',
  ],
  bracketSameLine: false,
})
