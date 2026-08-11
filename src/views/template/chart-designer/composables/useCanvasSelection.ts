import { computed, onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue'
import type { ChartWidget } from '../types'

interface UseChartCanvasSelectionOptions {
  selectedWidgetIds: Readonly<Ref<readonly string[]>>
  widgets: Readonly<Ref<readonly ChartWidget[]>>
  onClearSelection: () => void
  onDuplicateSelected: () => void
  onRemoveSelected: () => void
  onSelectMany: (ids: readonly string[]) => void
}

interface MarqueeState {
  bounds: DOMRect
  currentX: number
  currentY: number
  pointerId: number
  startX: number
  startY: number
  widgetBounds: WidgetSelectionBounds[]
}

interface WidgetSelectionBounds {
  id: string
  rect: SelectionRect
}

interface SelectionRect {
  bottom: number
  left: number
  right: number
  top: number
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  const tagName = target.tagName.toLowerCase()
  return (
    ['input', 'select', 'textarea'].includes(tagName) ||
    target.isContentEditable ||
    !!target.closest('[contenteditable="true"], .ant-input, .ant-select')
  )
}

function isWidgetTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement && !!target.closest('[data-chart-widget-id]')
  )
}

function isSelectionActionTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest('[data-chart-selection-action]')
  )
}

function toSelectionRect(state: MarqueeState): SelectionRect {
  return {
    bottom: Math.max(state.startY, state.currentY),
    left: Math.min(state.startX, state.currentX),
    right: Math.max(state.startX, state.currentX),
    top: Math.min(state.startY, state.currentY),
  }
}

function intersects(a: SelectionRect, b: SelectionRect) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  )
}

function getWidgetSelectionRect(element: HTMLElement): SelectionRect {
  const rect = element.getBoundingClientRect()
  return {
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    top: rect.top,
  }
}

export function useChartCanvasSelection(
  options: UseChartCanvasSelectionOptions
) {
  const marquee = shallowRef<MarqueeState>()
  const suppressNextWidgetClick = shallowRef(false)
  const isMarqueeSelecting = computed(() => !!marquee.value)
  const hasSelection = computed(
    () => options.selectedWidgetIds.value.length > 0
  )
  const selectedCount = computed(() => options.selectedWidgetIds.value.length)

  const marqueeStyle = computed(() => {
    const state = marquee.value
    if (!state) return {}

    const rect = toSelectionRect(state)
    return {
      height: `${rect.bottom - rect.top}px`,
      transform: `translate3d(${rect.left - state.bounds.left}px, ${
        rect.top - state.bounds.top
      }px, 0)`,
      width: `${rect.right - rect.left}px`,
    }
  })

  let pointerFrameId: number | null = null
  let pendingPointerPosition: { x: number; y: number } | undefined

  function readWidgetBounds(container: HTMLElement) {
    const availableIds = new Set(
      options.widgets.value.map((widget) => widget.id)
    )
    return Array.from(
      container.querySelectorAll<HTMLElement>('[data-chart-widget-id]')
    )
      .map((element) => {
        const id = element.dataset.chartWidgetId
        if (!id || !availableIds.has(id)) return undefined
        return { id, rect: getWidgetSelectionRect(element) }
      })
      .filter((item): item is WidgetSelectionBounds => !!item)
  }

  function getIntersectingWidgetIds(
    widgetBounds: WidgetSelectionBounds[],
    rect: SelectionRect
  ) {
    return widgetBounds
      .filter((widget) => intersects(rect, widget.rect))
      .map((widget) => widget.id)
  }

  function cancelPointerFrame() {
    if (pointerFrameId === null) return
    window.cancelAnimationFrame(pointerFrameId)
    pointerFrameId = null
  }

  function commitPointerPosition() {
    const state = marquee.value
    const position = pendingPointerPosition
    pendingPointerPosition = undefined
    if (!state || !position) return

    marquee.value = {
      ...state,
      currentX: position.x,
      currentY: position.y,
    }
  }

  function flushPointerPosition(event?: PointerEvent) {
    cancelPointerFrame()
    if (event) {
      pendingPointerPosition = { x: event.clientX, y: event.clientY }
    }
    commitPointerPosition()
  }

  function handleCanvasPointerDown(
    event: PointerEvent,
    container: HTMLElement
  ) {
    if (
      event.button !== 0 ||
      isWidgetTarget(event.target) ||
      isSelectionActionTarget(event.target)
    ) {
      return
    }

    const target = event.currentTarget
    if (!(target instanceof HTMLElement)) return

    marquee.value = {
      bounds: container.getBoundingClientRect(),
      currentX: event.clientX,
      currentY: event.clientY,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      widgetBounds: readWidgetBounds(container),
    }
    if (event.isTrusted) {
      target.setPointerCapture(event.pointerId)
    }
    event.preventDefault()
  }

  function handleCanvasPointerMove(
    event: PointerEvent,
    _container: HTMLElement
  ) {
    const state = marquee.value
    if (!state || state.pointerId !== event.pointerId) return

    pendingPointerPosition = { x: event.clientX, y: event.clientY }
    if (pointerFrameId === null) {
      pointerFrameId = window.requestAnimationFrame(() => {
        pointerFrameId = null
        commitPointerPosition()
      })
    }
    event.preventDefault()
  }

  function handleCanvasPointerUp(event: PointerEvent, _container: HTMLElement) {
    flushPointerPosition(event)
    const state = marquee.value
    if (!state || state.pointerId !== event.pointerId) return

    const rect = toSelectionRect(state)
    const distance = Math.hypot(
      state.currentX - state.startX,
      state.currentY - state.startY
    )
    marquee.value = undefined

    if (distance < 4) {
      options.onClearSelection()
      return
    }

    suppressNextWidgetClick.value = true
    options.onSelectMany(getIntersectingWidgetIds(state.widgetBounds, rect))
  }

  function shouldSuppressWidgetClick() {
    if (!suppressNextWidgetClick.value) return false

    suppressNextWidgetClick.value = false
    return true
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isEditableTarget(event.target) || selectedCount.value === 0) return

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      options.onDuplicateSelected()
      return
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      options.onRemoveSelected()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    cancelPointerFrame()
    pendingPointerPosition = undefined
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    hasSelection,
    isMarqueeSelecting,
    marqueeStyle,
    selectedCount,
    handleCanvasPointerDown,
    handleCanvasPointerMove,
    handleCanvasPointerUp,
    shouldSuppressWidgetClick,
  }
}
