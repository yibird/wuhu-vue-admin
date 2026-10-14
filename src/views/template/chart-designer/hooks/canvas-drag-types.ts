export interface DragBounds {
  bottom: number
  left: number
  right: number
  top: number
}

export interface DragState {
  height: number
  id: string
  index: number
  insertIndex: number
  offsetX: number
  offsetY: number
  pointerId: number
  width: number
}

export interface PendingPressState {
  id: string
  index: number
  pointerId: number
  startX: number
  startY: number
  target: HTMLElement
}

export interface WidgetDragRect {
  centerX: number
  centerY: number
  height: number
  id: string
  width: number
}
