import type { OxlintConfig } from 'vite-plus/lint'
export const lint: OxlintConfig = {
  rules: {
    'oxc/no-barrel-file': 'error',
    'import/no-cycle': 'off',
    'no-unused-expressions': 'off',
  },
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'import',
    'jsx-a11y',
    'promise',
    'vue',
    'oxc',
  ],
  overrides: [],
  ignorePatterns: ['node_modules', 'dist', '**/*.mock.ts.*.mjs'],
}
