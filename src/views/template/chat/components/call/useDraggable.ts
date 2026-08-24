import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  shallowRef,
  watch,
  type CSSProperties,
  type Ref,
} from 'vue'
import {
  useDragDropMonitor,
  useDraggable,
  type DragDropManager,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/vue'
import { Feedback } from '@dnd-kit/dom'

interface UseDraggableCallWindowOptions {
  disabled?: () => boolean
  fallbackHeight?: () => number
  fallbackWidth?: () => number
}

const viewportPadding = 16
const initialGap = 28
const draggableId = 'chat-call-window'
const feedbackPlugin = Feedback.configure({
  dropAnimation: null,
  feedback: 'move',
})

interface Point {
  x: number
  y: number
}

export function useDraggableCallWindow(
  windowRef: Ref<HTMLElement | null>,
  handleRef: Ref<HTMLElement | null>,
  options: UseDraggableCallWindowOptions = {}
) {
  const position = shallowRef({ x: viewportPadding, y: viewportPadding })
  const positioned = shallowRef(false)
  const dragging = shallowRef(false)
  const dragOrigin = shallowRef<Point | null>(null)

  useDraggable({
    disabled: computed(() => options.disabled?.() ?? false),
    element: windowRef,
    handle: handleRef,
    id: draggableId,
    plugins: [feedbackPlugin],
    type: 'chat-call-window',
  })

  let positionFrame = 0
  let resizeObserver: ResizeObserver | null = null
  let disposed = false

  const windowStyle = computed<CSSProperties>(
    () =>
      ({
        '--call-window-x': `${Math.round(position.value.x)}px`,
        '--call-window-y': `${Math.round(position.value.y)}px`,
        visibility: positioned.value ? 'visible' : 'hidden',
      }) as CSSProperties
  )

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }

  function getMeasuredWindowSize() {
    const rect = windowRef.value?.getBoundingClientRect()
    return {
      height: rect?.height ?? 0,
      width: rect?.width ?? 0,
    }
  }

  function getWindowSize() {
    const measured = getMeasuredWindowSize()
    const maxWidth = Math.max(
      viewportPadding,
      window.innerWidth - viewportPadding * 2
    )
    const maxHeight = Math.max(
      viewportPadding,
      window.innerHeight - viewportPadding * 2
    )

    return {
      height: clamp(
        measured.height || options.fallbackHeight?.() || 420,
        viewportPadding,
        maxHeight
      ),
      width: clamp(
        measured.width || options.fallbackWidth?.() || 380,
        viewportPadding,
        maxWidth
      ),
    }
  }

  function resetWindowPosition() {
    const { width, height } = getWindowSize()
    position.value = {
      x: Math.max(viewportPadding, window.innerWidth - width - initialGap),
      y: Math.max(viewportPadding, window.innerHeight - height - initialGap),
    }
    positioned.value = true
  }

  function keepWindowInViewport() {
    position.value = clampPosition(position.value)
  }

  function clampPosition(nextPosition: Point) {
    const { width, height } = getWindowSize()
    return {
      x: clamp(
        nextPosition.x,
        viewportPadding,
        Math.max(viewportPadding, window.innerWidth - width - viewportPadding)
      ),
      y: clamp(
        nextPosition.y,
        viewportPadding,
        Math.max(viewportPadding, window.innerHeight - height - viewportPadding)
      ),
    }
  }

  function cancelScheduledPosition() {
    if (!positionFrame) return

    window.cancelAnimationFrame(positionFrame)
    positionFrame = 0
  }

  function resetWindowPositionAfterRender() {
    positioned.value = false
    cancelScheduledPosition()
    nextTick(() => {
      if (disposed) return
      positionFrame = window.requestAnimationFrame(() => {
        positionFrame = window.requestAnimationFrame(() => {
          positionFrame = 0
          if (disposed) return
          resetWindowPosition()
        })
      })
    })
  }

  function keepWindowInViewportAfterRender() {
    cancelScheduledPosition()
    nextTick(() => {
      if (disposed) return
      positionFrame = window.requestAnimationFrame(() => {
        positionFrame = 0
        if (!disposed) keepWindowInViewport()
      })
    })
  }

  function placeWindowAtBottomRightAfterRender() {
    cancelScheduledPosition()
    nextTick(() => {
      if (disposed) return
      positionFrame = window.requestAnimationFrame(() => {
        positionFrame = 0
        if (!disposed) resetWindowPosition()
      })
    })
  }

  function isCallWindowDrag(sourceId: string | number | undefined) {
    return sourceId === draggableId
  }

  function handleDragStart(event: DragStartEvent) {
    if (!isCallWindowDrag(event.operation.source?.id)) return

    dragging.value = true
    dragOrigin.value = position.value
  }

  function handleDragMove(event: DragMoveEvent, manager: DragDropManager) {
    const origin = dragOrigin.value
    if (!origin || !isCallWindowDrag(event.operation.source?.id)) return

    const rawOffset = event.to
      ? {
          x: event.to.x - event.operation.position.initial.x,
          y: event.to.y - event.operation.position.initial.y,
        }
      : {
          x: event.operation.transform.x + (event.by?.x ?? 0),
          y: event.operation.transform.y + (event.by?.y ?? 0),
        }
    const nextPosition = clampPosition({
      x: origin.x + rawOffset.x,
      y: origin.y + rawOffset.y,
    })
    const nextOffset = {
      x: nextPosition.x - origin.x,
      y: nextPosition.y - origin.y,
    }

    if (nextOffset.x === rawOffset.x && nextOffset.y === rawOffset.y) {
      return
    }

    event.preventDefault()
    manager.actions.move({
      event: event.nativeEvent,
      propagate: false,
      to: {
        x: event.operation.position.initial.x + nextOffset.x,
        y: event.operation.position.initial.y + nextOffset.y,
      },
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!isCallWindowDrag(event.operation.source?.id)) return

    dragging.value = false
    if (!event.canceled && dragOrigin.value) {
      position.value = clampPosition({
        x: dragOrigin.value.x + event.operation.transform.x,
        y: dragOrigin.value.y + event.operation.transform.y,
      })
    }
    dragOrigin.value = null
  }

  useDragDropMonitor({
    onDragEnd: handleDragEnd,
    onDragMove: handleDragMove,
    onDragStart: handleDragStart,
  })

  function observeWindowSize(element: HTMLElement | null) {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (!element) return

    resizeObserver = new ResizeObserver(() => {
      if (!positioned.value || dragging.value) return

      keepWindowInViewport()
    })
    resizeObserver.observe(element)
  }

  onMounted(() => {
    disposed = false
    window.addEventListener('resize', keepWindowInViewportAfterRender)
  })

  watch(windowRef, observeWindowSize, { immediate: true })

  onUnmounted(() => {
    disposed = true
    cancelScheduledPosition()
    resizeObserver?.disconnect()
    window.removeEventListener('resize', keepWindowInViewportAfterRender)
  })

  return {
    dragging,
    windowStyle,
    keepWindowInViewportAfterRender,
    placeWindowAtBottomRightAfterRender,
    resetWindowPositionAfterRender,
  }
}
