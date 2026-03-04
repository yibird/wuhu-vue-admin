import type { Rule } from 'unocss'

type Direction = 't' | 'r' | 'b' | 'l' | 'all'
type SizeKey = 'sm' | 'md' | '' | 'lg' | 'xl' | '2xl'

interface Size {
  offset: number
  blur: number
  spread: number
  color: string
}
type BoxShadowStyles = Record<string, { 'box-shadow': string }>

const directions: Direction[] = ['t', 'r', 'b', 'l', 'all']
const sizes: Record<SizeKey, Size> = {
  sm: { offset: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)' },
  '': { offset: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)' },
  md: { offset: 4, blur: 15, spread: -1, color: 'rgba(0, 0, 0, 0.1)' },
  lg: { offset: 6, blur: 25, spread: -3, color: 'rgba(0, 0, 0, 0.1)' },
  xl: { offset: 20, blur: 50, spread: -12, color: 'rgba(0, 0, 0, 0.1)' },
  '2xl': { offset: 30, blur: 16, spread: -15, color: 'rgba(0, 0, 0, 0.25)' },
}

function generateBoxShadows() {
  return directions.reduce((acc: BoxShadowStyles, direction: Direction) => {
    Object.keys(sizes).forEach((sizeKey: string) => {
      const size = sizes[sizeKey as SizeKey]
      const key = `${direction}${sizeKey ? '-' + sizeKey : sizeKey}`
      let boxShadow: string

      if (direction === 'all') {
        boxShadow = `0px 0px ${size.blur}px ${size.spread}px ${size.color}`
      } else {
        const horizontalOffset = ['l', 'r'].includes(direction)
          ? direction === 'r'
            ? size.offset
            : -size.offset
          : 0
        const verticalOffset = ['t', 'b'].includes(direction)
          ? direction === 'b'
            ? size.offset
            : -size.offset
          : 0
        boxShadow = `${horizontalOffset}px ${verticalOffset}px ${size.blur}px ${size.spread}px ${size.color}`
      }
      acc[key] = { 'box-shadow': boxShadow }
    })
    return acc
  }, {} as BoxShadowStyles)
}

const shadows = generateBoxShadows()

export const shadowRule: Rule = [
  /^shadow-(t|r|b|l|all)(?:-(sm|md|lg|xl|2xl))?$/,
  ([s]) => {
    return shadows[s.replace('shadow-', '')]
  },
]
