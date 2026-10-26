import {
  bgTokens,
  borderColorTokens,
  shadowTokens,
  textColorTokens,
} from '../token'
import type { Rule } from 'unocss'

function createColorRules(
  prefix: string,
  property: string,
  tokens: Record<string, string>
): Rule[] {
  return Object.entries(tokens).map(([key, value]) => [
    `${prefix}-${key}`,
    { [property]: value },
  ])
}

export const colorRules: Rule[] = [
  ...createColorRules('text', 'color', textColorTokens),
  ...createColorRules('bg', 'background-color', bgTokens),
  ...createColorRules('border', 'border-color', borderColorTokens),
  ...createColorRules('shadow', 'box-shadow', shadowTokens),
]
