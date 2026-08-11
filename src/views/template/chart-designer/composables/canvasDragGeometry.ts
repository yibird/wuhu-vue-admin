import { clamp } from './canvasDragUtils'
import type { DragBounds, WidgetDragRect } from './canvasDragTypes'

export function readCanvasBounds(container: HTMLElement): DragBounds {
  const rect = container.getBoundingClientRect()

  return {
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    top: rect.top,
  }
}

export function readWidgetRects(container: HTMLElement): WidgetDragRect[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[data-chart-widget-id]')
  ).map((element) => {
    const rect = element.getBoundingClientRect()

    return {
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      height: rect.height,
      id: element.dataset.chartWidgetId ?? '',
      width: rect.width,
    }
  })
}

export function getInsertIndex(
  rects: readonly WidgetDragRect[],
  clientX: number,
  clientY: number,
  draggingId?: string
) {
  const visibleRects = rects.filter((item) => item.id !== draggingId)
  const index = findPointerIndex(visibleRects, clientX, clientY)

  return clamp(
    index === -1 ? visibleRects.length : index,
    0,
    visibleRects.length
  )
}

export function getDropIndex(
  rects: readonly WidgetDragRect[],
  clientX: number,
  clientY: number
) {
  const index = findPointerIndex(rects, clientX, clientY)
  return index === -1 ? rects.length : index
}

function findPointerIndex(
  rects: readonly WidgetDragRect[],
  clientX: number,
  clientY: number
) {
  return rects.findIndex(
    (item) =>
      clientY < item.centerY ||
      (Math.abs(clientY - item.centerY) < item.height / 2 &&
        clientX < item.centerX)
  )
}
