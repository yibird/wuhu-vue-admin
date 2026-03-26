import type { Rule } from 'unocss'

const DIRECTION: Recordable = { t: 'top', r: 'right', b: 'bottom', l: 'left' }

// bd-2px_dashed_red
export const borderRule: Rule = [
  /^b(t|r|b|l|d)_(.*)/,
  ([, d, c]) => {
    const direction = DIRECTION[d] || ''
    const p = direction ? `border-${direction}` : 'border'
    const attrs = c.split('_')
    if (
      !attrs.some((item) =>
        /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/.test(
          item
        )
      )
    ) {
      attrs.push('solid')
    }
    // 属性中不包含 border-width 则默认 1px
    if (!attrs.some((item) => /^\d/.test(item))) {
      attrs.push('1px')
    }
    return {
      [p]: attrs.join(' '),
    }
  },
]
