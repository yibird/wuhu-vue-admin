/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    'coverage/**',
    '.agents/**',
    '.claude/**',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-less',
    'stylelint-config-recommended-vue',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.{css,less}'],
      customSyntax: 'postcss-less',
    },
  ],
  rules: {
    'import-notation': 'string',
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'deep'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'use',
          'mixin',
          'include',
          'extend',
          'each',
          'if',
          'else',
          'for',
          'while',
        ],
      },
    ],
  },
}
