export const lint = {
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
  overrides: [
    {
      files: ['src/constants/**'],
      rules: {
        'oxc/no-barrel-file': 'off',
      },
    },
    {
      files: ['src/utils/**'],
      rules: {
        'oxc/no-barrel-file': 'off',
      },
    },
    {
      files: ['src/errors/**'],
      rules: {
        'oxc/no-barrel-file': 'off',
      },
    },
    {
      files: ['src/hooks/**'],
      rules: {
        'oxc/no-barrel-file': 'off',
      },
    },
    {
      files: ['src/apis/**'],
      rules: {
        'oxc/no-barrel-file': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules', 'dist', '**/*.mock.ts.*.mjs'],
}
