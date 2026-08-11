import { computed, nextTick, onBeforeUnmount, shallowRef, type Ref } from 'vue'
import type { ChartWidget } from '../types'
import {
  getDropIndex,
  getInsertIndex,
  readCanvasBounds,
  readWidgetRects,
} from './canvasDragGeometry'
import type {
  DragState,
  PendingPressState,
  WidgetDragRect,
} from './canvasDragTypes'
import {
  clamp,
  clearTextSelection,
  dragStartDistance,
  emptyCanvasBounds,
  isActionTarget,
  isPaletteDrag,
  moveId,
  setDocumentDraggingState,
} from './canvasDragUtils'

interface UseChartCanvasDragOptions {
  widgets: Readonly<Ref<readonly ChartWidget[]>>
  onDropWidget: (event: DragEvent, insertIndex?: number) => void
  onReorder: (orderedIds: string[], selectedId: string) => void
  onSelect: (id: string) => void
}

export function useChartCanvasDrag(options: UseChartCanvasDragOptions) {
  const dragState = shallowRef<DragState>()
  const pendingPress = shallowRef<PendingPressState>()
  const widgetRects = shallowRef<WidgetDragRect[]>([])
  const pointerPosition = shallowRef({ x: 0, y: 0 })
  const canvasBounds = shallowRef(emptyCanvasBounds)

  const isDraggingWidget = computed(() => !!dragState.value)
  const orderedIds = computed(() => {
    const ids = options.widgets.value.map((widget) => widget.id)
    const dragging = dragState.value
    if (!dragging) return ids

    return moveId(ids, dragging.index, dragging.insertIndex)
  })
  const orderedWidgets = computed(() => {
    const widgetMap = new Map(
      options.widgets.value.map((widget) => [widget.id, widget])
    )
    return orderedIds.value
      .map((id) => widgetMap.get(id))
      .filter((widget): widget is ChartWidget => !!widget)
  })
  const draggingWidget = computed(() => {
    const dragging = dragState.value
    if (!dragging) return undefined

    return options.widgets.value.find((widget) => widget.id === dragging.id)
  })
  const dragOverlayStyle = computed(() => {
    const dragging = dragState.value
    if (!dragging) return {}

    const bounds = canvasBounds.value
    const rawLeft = pointerPosition.value.x - dragging.offsetX
    const rawTop = pointerPosition.value.y - dragging.offsetY
    const maxLeft = Math.max(bounds.left, bounds.right - dragging.width)
    const maxTop = Math.max(bounds.top, bounds.bottom - dragging.height)

    return {
      height: `${dragging.height}px`,
      transform: `translate3d(${clamp(rawLeft, bounds.left, maxLeft)}px, ${clamp(
        rawTop,
        bounds.top,
        maxTop
      )}px, 0)`,
      width: `${dragging.width}px`,
    }
  })
  const placeholderStyle = computed(() => {
    const dragging = dragState.value
    if (!dragging) return {}

    return {
      gridColumn: `span ${draggingWidget.value?.colSpan ?? 4} / span ${
        draggingWidget.value?.colSpan ?? 4
      }`,
      gridRow: `span ${draggingWidget.value?.rowSpan ?? 2} / span ${
        draggingWidget.value?.rowSpan ?? 2
      }`,
      minHeight: `${dragging.height}px`,
    }
  })

  function updateRects(container: HTMLElement) {
    canvasBounds.value = readCanvasBounds(container)
    widgetRects.value = readWidgetRects(container)
  }

  function handlePaletteDragOver(event: DragEvent) {
    if (!isPaletteDrag(event)) return

    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  function handlePaletteDrop(event: DragEvent, container: HTMLElement) {
    if (!isPaletteDrag(event)) return

    event.preventDefault()
    event.stopPropagation()
    updateRects(container)
    options.onDropWidget(
      event,
      getDropIndex(widgetRects.value, event.clientX, event.clientY)
    )
  }

  function clearPendingPress() {
    pendingPress.value = undefined
  }

  let pointerFrameId: number | null = null
  let pendingPointerPosition: { x: number; y: number } | undefined

  function cancelPointerFrame() {
    if (pointerFrameId === null) return
    window.cancelAnimationFrame(pointerFrameId)
    pointerFrameId = null
  }

  function commitPointerPosition() {
    const dragging = dragState.value
    const position = pendingPointerPosition
    pendingPointerPosition = undefined
    if (!dragging || !position) return

    pointerPosition.value = position
    const insertIndex = getInsertIndex(
      widgetRects.value,
      position.x,
      position.y,
      dragging.id
    )
    if (insertIndex !== dragging.insertIndex) {
      dragState.value = { ...dragging, insertIndex }
    }
  }

  function schedulePointerPosition(event: PointerEvent) {
    pendingPointerPosition = { x: event.clientX, y: event.clientY }
    if (pointerFrameId !== null) return

    pointerFrameId = window.requestAnimationFrame(() => {
      pointerFrameId = null
      commitPointerPosition()
    })
  }

  function flushPointerPosition(event?: PointerEvent) {
    cancelPointerFrame()
    if (event) {
      pendingPointerPosition = { x: event.clientX, y: event.clientY }
    }
    commitPointerPosition()
  }

  function cancelDrag() {
    cancelPointerFrame()
    pendingPointerPosition = undefined
    dragState.value = undefined
    clearPendingPress()
    setDocumentDraggingState(false)
    clearTextSelection()
  }

  function startDrag(event: PointerEvent, container: HTMLElement) {
    const pending = pendingPress.value
    if (!pending) return

    const rect = pending.target.getBoundingClientRect()
    updateRects(container)
    const nextDragState = {
      height: rect.height,
      id: pending.id,
      index: pending.index,
      insertIndex: pending.index,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      pointerId: pending.pointerId,
      width: rect.width,
    }
    pointerPosition.value = { x: event.clientX, y: event.clientY }
    dragState.value = nextDragState
    setDocumentDraggingState(true)
    clearTextSelection()
  }

  function handleWidgetPointerDown(
    event: PointerEvent,
    widget: ChartWidget,
    index: number
  ) {
    if (event.button !== 0 || isActionTarget(event.target)) return
    const target = event.currentTarget
    if (!(target instanceof HTMLElement)) return

    pendingPress.value = {
      id: widget.id,
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      target,
    }
    target.setPointerCapture(event.pointerId)
  }

  function handleWidgetPointerMove(
    event: PointerEvent,
    container: HTMLElement
  ) {
    const dragging = dragState.value
    if (!dragging) {
      const pending = pendingPress.value
      if (!pending || pending.pointerId !== event.pointerId) return

      const distance = Math.hypot(
        event.clientX - pending.startX,
        event.clientY - pending.startY
      )
      if (distance < dragStartDistance) return

      startDrag(event, container)
      event.preventDefault()
      return
    }

    if (dragging.pointerId !== event.pointerId) return

    schedulePointerPosition(event)
    event.preventDefault()
  }

  function handleWidgetPointerEnd(event: PointerEvent) {
    flushPointerPosition(event)
    const dragging = dragState.value
    const pending = pendingPress.value

    if (!dragging) {
      if (pending?.pointerId === event.pointerId) {
        options.onSelect(pending.id)
      }
      clearPendingPress()
      return
    }

    if (dragging.pointerId !== event.pointerId) return

    const ids = options.widgets.value.map((widget) => widget.id)
    const nextIds = moveId(ids, dragging.index, dragging.insertIndex)
    dragState.value = undefined
    clearPendingPress()
    setDocumentDraggingState(false)
    clearTextSelection()

    if (nextIds.join('|') !== ids.join('|')) {
      options.onReorder(nextIds, dragging.id)
      return
    }

    options.onSelect(dragging.id)
  }

  function handleWidgetPointerCancel(event: PointerEvent) {
    if (
      event.pointerId !== dragState.value?.pointerId &&
      event.pointerId !== pendingPress.value?.pointerId
    ) {
      return
    }

    cancelDrag()
  }

  function refreshAfterDomUpdate(container?: HTMLElement) {
    if (!container) return

    void nextTick(() => updateRects(container))
  }

  onBeforeUnmount(() => {
    cancelDrag()
  })

  return {
    dragOverlayStyle,
    draggingWidget,
    isDraggingWidget,
    orderedWidgets,
    placeholderStyle,
    handlePaletteDragOver,
    handlePaletteDrop,
    handleWidgetPointerCancel,
    handleWidgetPointerDown,
    handleWidgetPointerEnd,
    handleWidgetPointerMove,
    refreshAfterDomUpdate,
  }
}
