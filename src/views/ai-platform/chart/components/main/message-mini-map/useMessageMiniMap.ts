import { shallowRef } from 'vue'
import type { MessageMiniMapOptions } from './types'

export function useMessageMiniMap(options: MessageMiniMapOptions = {}) {
  const { width = 15, radius = 4, maxWidth = 40, stiffness = 0.15 } = options

  const hoverIndex = shallowRef(-1)

  function getStrength(index: number) {
    if (hoverIndex.value < 0) return 0

    const distance = Math.abs(index - hoverIndex.value)

    return Math.pow(
      Math.max(0, 1 - distance / radius),
      Math.max(1, 2 - stiffness)
    )
  }

  function getWidth(index: number, base = width) {
    const strength = getStrength(index)

    return base + strength * (maxWidth - base)
  }

  function getScaleX(index: number) {
    return getWidth(index) / Math.max(maxWidth, 1)
  }

  return {
    hoverIndex,
    getScaleX,
    getStrength,
  }
}
