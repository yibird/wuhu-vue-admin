import type { EditorHeadingLevel } from './types'

export function sizeValue(value?: number | string) {
  if (typeof value === 'number') return `${value}px`
  return value
}

export function getStringAttribute(
  attributes: Record<string, unknown>,
  key: string
) {
  const value = attributes[key]
  return typeof value === 'string' ? value : ''
}

export function isEditorHeadingLevel(
  value: number
): value is EditorHeadingLevel {
  switch (value) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return true
    default:
      return false
  }
}
