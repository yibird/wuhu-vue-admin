import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import type { ShallowRef } from 'vue'

interface CanvasPoint {
  readonly x: number
  readonly y: number
}

interface SelectionBounds {
  readonly bottom: number
  readonly left: number
  readonly right: number
  readonly top: number
}

interface NodeSelectionBounds {
  readonly bounds: SelectionBounds
  readonly id: string
}

interface SelectionMetrics {
  readonly canvasLeft: number
  readonly canvasTop: number
  readonly nodeBounds: NodeSelectionBounds[]
  readonly scrollLeft: number
  readonly scrollTop: number
}

export interface ApprovalCanvasInteractionActions {
  duplicateSelected: () => void
  removeSelected: () => void
  selectMany: (ids: string[]) => void
}

const MIN_SELECTION_SIZE = 6

export function useApprovalCanvasInteraction(
  canvasRef: Readonly<ShallowRef<HTMLElement | null>>,
  actions: ApprovalCanvasInteractionActions,
  getScrollElement?: () => HTMLElement | null
) {
  const zoom = shallowRef(1)
  const selecting = shallowRef(false)
  const selectionStart = shallowRef<CanvasPoint>({ x: 0, y: 0 })
  const selectionEnd = shallowRef<CanvasPoint>({ x: 0, y: 0 })
  const selectionDisplayStart = shallowRef<CanvasPoint>({ x: 0, y: 0 })
  const selectionDisplayEnd = shallowRef<CanvasPoint>({ x: 0, y: 0 })
  const marqueeSelectedIds = shallowRef<string[]>([])
  let lastCopyShortcutAt = 0
  let selectionMetrics: SelectionMetrics | null = null
  let pointerFrameId: number | null = null
  let pendingPointerEvent: PointerEvent | null = null

  const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`)
  const canvasContentStyle = computed(() => ({
    transform: `scale(${zoom.value})`,
  }))
  const selectionRect = computed(() => {
    const left = Math.min(
      selectionDisplayStart.value.x,
      selectionDisplayEnd.value.x
    )
    const top = Math.min(
      selectionDisplayStart.value.y,
      selectionDisplayEnd.value.y
    )
    const width = Math.abs(
      selectionDisplayEnd.value.x - selectionDisplayStart.value.x
    )
    const height = Math.abs(
      selectionDisplayEnd.value.y - selectionDisplayStart.value.y
    )

    return {
      transform: `translate3d(${left}px, ${top}px, 0)`,
      width: `${width}px`,
      height: `${height}px`,
    }
  })

  function getCanvasScrollElement() {
    return getScrollElement?.() ?? canvasRef.value
  }

  function setZoom(value: number) {
    zoom.value = Math.min(1.6, Math.max(0.6, Number(value.toFixed(2))))
  }

  function getCanvasPoint(
    event: PointerEvent | WheelEvent,
    metrics = getSelectionMetrics()
  ) {
    const canvas = canvasRef.value
    if (!canvas || !metrics) return { x: 0, y: 0 }

    return {
      x: (event.clientX - metrics.canvasLeft + metrics.scrollLeft) / zoom.value,
      y: (event.clientY - metrics.canvasTop + metrics.scrollTop) / zoom.value,
    }
  }

  function getCanvasDisplayPoint(
    event: PointerEvent,
    metrics = getSelectionMetrics()
  ) {
    const canvas = canvasRef.value
    if (!canvas || !metrics) return { x: 0, y: 0 }

    return {
      x: event.clientX - metrics.canvasLeft + metrics.scrollLeft,
      y: event.clientY - metrics.canvasTop + metrics.scrollTop,
    }
  }

  function getSelectionMetrics(): SelectionMetrics | null {
    const canvas = canvasRef.value
    if (!canvas) return null

    const canvasRect = canvas.getBoundingClientRect()
    const scrollElement = getCanvasScrollElement()
    const scrollLeft = scrollElement?.scrollLeft ?? 0
    const scrollTop = scrollElement?.scrollTop ?? 0
    const nodeBounds = Array.from(
      canvas.querySelectorAll<HTMLElement>('[data-approval-node-id]')
    )
      .map((node) => {
        const id = node.dataset.approvalNodeId
        if (!id) return undefined

        const rect = node.getBoundingClientRect()
        return {
          id,
          bounds: {
            bottom: (rect.bottom - canvasRect.top + scrollTop) / zoom.value,
            left: (rect.left - canvasRect.left + scrollLeft) / zoom.value,
            right: (rect.right - canvasRect.left + scrollLeft) / zoom.value,
            top: (rect.top - canvasRect.top + scrollTop) / zoom.value,
          },
        }
      })
      .filter((item): item is NodeSelectionBounds => !!item)

    return {
      canvasLeft: canvasRect.left,
      canvasTop: canvasRect.top,
      nodeBounds,
      scrollLeft,
      scrollTop,
    }
  }

  function createSelectionBounds(
    start: CanvasPoint,
    end: CanvasPoint
  ): SelectionBounds {
    return {
      bottom: Math.max(start.y, end.y),
      left: Math.min(start.x, end.x),
      right: Math.max(start.x, end.x),
      top: Math.min(start.y, end.y),
    }
  }

  function hasSelectionArea(bounds: SelectionBounds) {
    return (
      bounds.right - bounds.left >= MIN_SELECTION_SIZE ||
      bounds.bottom - bounds.top >= MIN_SELECTION_SIZE
    )
  }

  function intersects(a: SelectionBounds, b: SelectionBounds) {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    )
  }

  function shouldStartBoxSelection(event: PointerEvent) {
    if (event.button !== 0) return false
    const target = event.target
    if (!(target instanceof HTMLElement)) return false
    return !target.closest('.approval-add-btn, .ant-btn')
  }

  function getNodeIdsInSelection(selectionBounds: SelectionBounds) {
    return (selectionMetrics?.nodeBounds ?? [])
      .filter((node) => intersects(selectionBounds, node.bounds))
      .map((node) => node.id)
  }

  function updateMarqueeSelection() {
    const selectionBounds = createSelectionBounds(
      selectionStart.value,
      selectionEnd.value
    )
    const ids = hasSelectionArea(selectionBounds)
      ? getNodeIdsInSelection(selectionBounds)
      : []

    marqueeSelectedIds.value = ids
    return { ids, selectionBounds }
  }

  function handlePointerDown(event: PointerEvent) {
    if (!shouldStartBoxSelection(event)) return
    event.preventDefault()
    canvasRef.value?.focus({ preventScroll: true })
    selectionMetrics = getSelectionMetrics()
    const point = getCanvasPoint(event, selectionMetrics)
    const displayPoint = getCanvasDisplayPoint(event, selectionMetrics)
    selecting.value = true
    selectionStart.value = point
    selectionEnd.value = point
    selectionDisplayStart.value = displayPoint
    selectionDisplayEnd.value = displayPoint
    marqueeSelectedIds.value = []
    canvasRef.value?.setPointerCapture(event.pointerId)
  }

  function applyPointerMove(event: PointerEvent) {
    selectionEnd.value = getCanvasPoint(event, selectionMetrics)
    selectionDisplayEnd.value = getCanvasDisplayPoint(event, selectionMetrics)
    updateMarqueeSelection()
  }

  function cancelPointerFrame() {
    if (pointerFrameId === null) return
    window.cancelAnimationFrame(pointerFrameId)
    pointerFrameId = null
  }

  function flushPointerMove(event?: PointerEvent) {
    cancelPointerFrame()
    const nextEvent = event ?? pendingPointerEvent
    pendingPointerEvent = null
    if (nextEvent && selecting.value) applyPointerMove(nextEvent)
  }

  function handlePointerMove(event: PointerEvent) {
    if (!selecting.value) return
    pendingPointerEvent = event
    if (pointerFrameId !== null) return

    pointerFrameId = window.requestAnimationFrame(() => {
      pointerFrameId = null
      const nextEvent = pendingPointerEvent
      pendingPointerEvent = null
      if (nextEvent && selecting.value) applyPointerMove(nextEvent)
    })
  }

  function handlePointerUp(event: PointerEvent) {
    if (!selecting.value) return
    flushPointerMove(event)
    const { ids, selectionBounds } = updateMarqueeSelection()

    selecting.value = false
    if (canvasRef.value?.hasPointerCapture(event.pointerId)) {
      canvasRef.value.releasePointerCapture(event.pointerId)
    }

    canvasRef.value?.focus({ preventScroll: true })
    if (hasSelectionArea(selectionBounds)) actions.selectMany(ids)
    marqueeSelectedIds.value = []
    selectionMetrics = null
  }

  function handlePointerCancel(event: PointerEvent) {
    if (!selecting.value) return
    cancelPointerFrame()
    pendingPointerEvent = null
    selecting.value = false
    marqueeSelectedIds.value = []
    if (canvasRef.value?.hasPointerCapture(event.pointerId)) {
      canvasRef.value.releasePointerCapture(event.pointerId)
    }
    selectionMetrics = null
  }

  function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    if (target.isContentEditable) return true
    return Boolean(
      target.closest(
        'input, textarea, select, [contenteditable="true"], .ant-select, .ant-input, .ant-input-number, .ant-modal'
      )
    )
  }

  function isCanvasShortcutActive() {
    const canvas = canvasRef.value
    if (!canvas) return false
    const activeElement = document.activeElement

    return (
      activeElement === canvas ||
      (activeElement instanceof HTMLElement && canvas.contains(activeElement))
    )
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isCanvasShortcutActive()) return
    if (isEditableTarget(event.target)) return
    const key = event.key.toLowerCase()
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      actions.removeSelected()
      return
    }
    if ((event.ctrlKey || event.metaKey) && key === 'c') {
      event.preventDefault()
      duplicateSelectedFromCopyShortcut()
      return
    }
    if ((event.ctrlKey || event.metaKey) && key === 'd') {
      event.preventDefault()
      actions.duplicateSelected()
    }
  }

  function duplicateSelectedFromCopyShortcut() {
    const now = Date.now()
    if (now - lastCopyShortcutAt < 80) return
    lastCopyShortcutAt = now
    actions.duplicateSelected()
  }

  function handleCopy(event: ClipboardEvent) {
    if (!isCanvasShortcutActive()) return
    if (isEditableTarget(event.target)) return
    event.preventDefault()
    duplicateSelectedFromCopyShortcut()
  }

  function handleWheel(event: WheelEvent) {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    setZoom(zoom.value + (event.deltaY > 0 ? -0.08 : 0.08))
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('copy', handleCopy)
    window.addEventListener('pointermove', handlePointerMove, true)
    window.addEventListener('pointerup', handlePointerUp, true)
    window.addEventListener('pointercancel', handlePointerCancel, true)
  })

  onUnmounted(() => {
    cancelPointerFrame()
    pendingPointerEvent = null
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('copy', handleCopy)
    window.removeEventListener('pointermove', handlePointerMove, true)
    window.removeEventListener('pointerup', handlePointerUp, true)
    window.removeEventListener('pointercancel', handlePointerCancel, true)
  })

  return {
    canvasContentStyle,
    marqueeSelectedIds,
    selecting,
    selectionRect,
    zoom,
    zoomLabel,
    handlePointerDown,
    handlePointerMove,
    handlePointerCancel,
    handlePointerUp,
    handleWheel,
    setZoom,
  }
}
