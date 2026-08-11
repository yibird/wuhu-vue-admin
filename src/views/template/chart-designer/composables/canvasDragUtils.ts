export const bodyDraggingClass = 'chart-designer--dragging'
export const dragStartDistance = 4
export const emptyCanvasBounds = { bottom: 0, left: 0, right: 0, top: 0 }

export function setDocumentDraggingState(value: boolean) {
  if (typeof document === 'undefined') return

  document.body.classList.toggle(bodyDraggingClass, value)
}

export function clearTextSelection() {
  if (typeof window === 'undefined') return

  window.getSelection()?.removeAllRanges()
}

export function isPaletteDrag(event: DragEvent) {
  return Array.from(event.dataTransfer?.types ?? []).includes(
    'chart-palette-item'
  )
}

export function isActionTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest('[data-chart-widget-action]')
  )
}

export function moveId(ids: string[], fromIndex: number, toIndex: number) {
  const nextIds = [...ids]
  const [target] = nextIds.splice(fromIndex, 1)
  if (!target) return ids

  nextIds.splice(toIndex, 0, target)
  return nextIds
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
