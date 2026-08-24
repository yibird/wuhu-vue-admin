import type { Rule } from 'unocss'

export const contentVisibilityRule: Rule = [
  /^content-auto-(\d+)$/,
  ([, height]) => ({
    'content-visibility': 'auto',
    'contain-intrinsic-size': `0 ${height}px`,
  }),
]
