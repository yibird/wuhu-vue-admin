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
    // boneyard 自动生成的骨骼与注册表
    'src/bones/**',
    // 字体脚本生成的扩展子集声明
    'src/styles/fonts.extended.css',
  ],
  bracketSameLine: false,
}
