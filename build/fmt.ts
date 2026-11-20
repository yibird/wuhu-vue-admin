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
    // 字体脚本生成与第三方字体包自带的声明
    'src/styles/fonts/fonts.extended.css',
    'src/assets/fonts/cjk/**',
  ],
  bracketSameLine: false,
}
