export const fmt = {
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
    '**/*.mock.ts.*.mjs',
    // 字体脚本生成的扩展子集声明
    'src/styles/fonts.extended.css',
  ],
  bracketSameLine: false,
}
