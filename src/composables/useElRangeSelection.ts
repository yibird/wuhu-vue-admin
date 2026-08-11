import { useEventListener } from '@vueuse/core'
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  toValue,
  type CSSProperties,
  type MaybeRefOrGetter,
} from 'vue'

export type ElRangeSelectionHitMode = 'intersect' | 'contain'

export interface ElRangeSelectionRect {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}

export interface ElRangeSelectionTarget {
  key: string
  element: MaybeRefOrGetter<HTMLElement | null | undefined>
  disabled?: MaybeRefOrGetter<boolean>
}

export interface UseElRangeSelectionOptions {
  container: MaybeRefOrGetter<HTMLElement | null | undefined>
  targets: MaybeRefOrGetter<readonly ElRangeSelectionTarget[]>
  disabled?: MaybeRefOrGetter<boolean>
  ignoreTarget?: (target: EventTarget | null) => boolean
  minSize?: number
  hitMode?: MaybeRefOrGetter<ElRangeSelectionHitMode>
  shouldStart?: (event: PointerEvent) => boolean
}

interface ElRangeSelectionSession {
  captureTarget?: HTMLElement
  current: ElRangeSelectionPoint
  pointerId: number
  start: ElRangeSelectionPoint
}

interface ElRangeSelectionPoint {
  x: number
  y: number
}

interface ElRangeSelectionMetrics {
  left: number
  scrollLeft: number
  scrollTop: number
  top: number
}

interface ResolvedTarget {
  key: string
  rect: ElRangeSelectionRect
}

const DEFAULT_MIN_SIZE = 6
const DEFAULT_IGNORE_SELECTOR =
  'button, a, input, textarea, select, option, [contenteditable="true"], [data-el-range-selection-ignore]'

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return !!target.closest(DEFAULT_IGNORE_SELECTOR)
}

function createMetrics(container: HTMLElement): ElRangeSelectionMetrics {
  const rect = container.getBoundingClientRect()
  return {
    left: rect.left,
    scrollLeft: container.scrollLeft,
    scrollTop: container.scrollTop,
    top: rect.top,
  }
}

function createLocalPoint(
  event: PointerEvent,
  metrics: ElRangeSelectionMetrics
): ElRangeSelectionPoint {
  return {
    x: event.clientX - metrics.left + metrics.scrollLeft,
    y: event.clientY - metrics.top + metrics.scrollTop,
  }
}

function createRect(
  start: ElRangeSelectionPoint,
  current: ElRangeSelectionPoint
) {
  const left = Math.min(start.x, current.x)
  const top = Math.min(start.y, current.y)
  const right = Math.max(start.x, current.x)
  const bottom = Math.max(start.y, current.y)

  return {
    bottom,
    height: bottom - top,
    left,
    right,
    top,
    width: right - left,
    x: left,
    y: top,
  }
}

function intersects(a: ElRangeSelectionRect, b: ElRangeSelectionRect) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  )
}

function contains(a: ElRangeSelectionRect, b: ElRangeSelectionRect) {
  return (
    a.left <= b.left &&
    a.right >= b.right &&
    a.top <= b.top &&
    a.bottom >= b.bottom
  )
}

function getTargetRect(
  container: HTMLElement,
  element: HTMLElement
): ElRangeSelectionRect {
  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  const left = elementRect.left - containerRect.left + container.scrollLeft
  const top = elementRect.top - containerRect.top + container.scrollTop

  return {
    bottom: top + elementRect.height,
    height: elementRect.height,
    left,
    right: left + elementRect.width,
    top,
    width: elementRect.width,
    x: left,
    y: top,
  }
}

function uniqueKeys(keys: string[]) {
  return Array.from(new Set(keys.filter(Boolean)))
}

export function useElRangeSelection(options: UseElRangeSelectionOptions) {
  const selectedKeys = shallowRef<string[]>([])
  const previewKeys = shallowRef<string[]>([])
  const session = shallowRef<ElRangeSelectionSession>()

  const isSelecting = computed(() => !!session.value)
  const activeKeys = computed(() =>
    session.value ? previewKeys.value : selectedKeys.value
  )
  const activeKeySet = computed(() => new Set(activeKeys.value))
  const selectedKeySet = computed(() => new Set(selectedKeys.value))
  const previewKeySet = computed(() => new Set(previewKeys.value))
  const selectionRect = computed<ElRangeSelectionRect | null>(() => {
    const currentSession = session.value
    if (!currentSession) return null
    return createRect(currentSession.start, currentSession.current)
  })
  const selectionStyle = computed<CSSProperties>(() => {
    const rect = selectionRect.value
    if (!rect) return {}

    return {
      height: `${rect.height}px`,
      transform: `translate3d(${rect.x}px, ${rect.y}px, 0)`,
      width: `${rect.width}px`,
    }
  })

  const resolvedTargets = computed<ResolvedTarget[]>(() => {
    const container = toValue(options.container)
    if (!container) return []

    return toValue(options.targets)
      .map((item) => {
        const element = toValue(item.element)
        if (!(element instanceof HTMLElement)) return undefined
        if (toValue(item.disabled)) return undefined
        return {
          key: item.key,
          rect: getTargetRect(container, element),
        }
      })
      .filter((item): item is ResolvedTarget => !!item)
  })
  const selectedTargets = computed(() => {
    const keys = selectedKeySet.value
    return resolvedTargets.value.filter((item) => keys.has(item.key))
  })

  function hitTest(rect = selectionRect.value) {
    if (!rect) return []

    const mode = toValue(options.hitMode) ?? 'intersect'
    return resolvedTargets.value
      .filter((item) =>
        mode === 'contain'
          ? contains(rect, item.rect)
          : intersects(rect, item.rect)
      )
      .map((item) => item.key)
  }

  function setSelectedKeys(keys: string[]) {
    selectedKeys.value = uniqueKeys(keys)
  }

  function clearPreview() {
    previewKeys.value = []
  }

  function clearSelection() {
    selectedKeys.value = []
    clearPreview()
    session.value = undefined
  }

  function updateSelection(event: PointerEvent) {
    const currentSession = session.value
    if (!currentSession || currentSession.pointerId !== event.pointerId)
      return false

    const container = toValue(options.container)
    if (!container) return false

    const metrics = createMetrics(container)
    const current = createLocalPoint(event, metrics)
    session.value = {
      ...currentSession,
      current,
    }
    previewKeys.value = hitTest(createRect(currentSession.start, current))
    return true
  }

  function releasePointerCapture(session: ElRangeSelectionSession) {
    const target = session.captureTarget
    if (!target) return
    if (!target.hasPointerCapture(session.pointerId)) return
    target.releasePointerCapture(session.pointerId)
  }

  function shouldIgnorePointerTarget(target: EventTarget | null) {
    return options.ignoreTarget
      ? options.ignoreTarget(target)
      : isInteractiveTarget(target)
  }

  function getCaptureTarget(event: PointerEvent) {
    const target = event.currentTarget
    if (!(target instanceof HTMLElement)) return undefined
    return target
  }

  function setPointerCapture(event: PointerEvent, target?: HTMLElement) {
    if (!target) return
    if (target.hasPointerCapture(event.pointerId)) return
    target.setPointerCapture(event.pointerId)
  }

  function startSelection(event: PointerEvent) {
    if (toValue(options.disabled)) return
    if (event.button !== 0) return
    if (options.shouldStart && !options.shouldStart(event)) return
    if (!options.shouldStart && shouldIgnorePointerTarget(event.target)) return

    const container = toValue(options.container)
    if (!container) return

    const metrics = createMetrics(container)
    const start = createLocalPoint(event, metrics)
    const captureTarget = getCaptureTarget(event)
    session.value = {
      captureTarget,
      current: start,
      pointerId: event.pointerId,
      start,
    }
    clearPreview()
    setPointerCapture(event, captureTarget)

    event.preventDefault()
  }

  function finishSelection(event: PointerEvent) {
    const currentSession = session.value
    if (!currentSession || currentSession.pointerId !== event.pointerId)
      return false

    updateSelection(event)
    const rect = selectionRect.value
    const minSize = options.minSize ?? DEFAULT_MIN_SIZE

    if (!rect || (rect.width < minSize && rect.height < minSize)) {
      clearSelection()
    } else {
      setSelectedKeys(previewKeys.value)
      session.value = undefined
      clearPreview()
    }

    releasePointerCapture(currentSession)
    event.preventDefault()
    return true
  }

  function cancelSelection(event?: PointerEvent) {
    const currentSession = session.value
    if (
      event &&
      currentSession &&
      currentSession.pointerId !== event.pointerId
    ) {
      return
    }

    if (currentSession) {
      releasePointerCapture(currentSession)
    }
    session.value = undefined
    clearPreview()
  }

  function toggleSelectedKey(key: string) {
    const next = new Set(selectedKeys.value)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    selectedKeys.value = Array.from(next)
  }

  function isSelected(key: string) {
    return selectedKeySet.value.has(key)
  }

  useEventListener(window, 'pointermove', (event) => {
    if (!session.value) return
    updateSelection(event)
  })

  useEventListener(window, 'pointerup', (event) => {
    if (!session.value) return
    finishSelection(event)
  })

  useEventListener(window, 'pointercancel', (event) => {
    if (!session.value) return
    cancelSelection(event)
  })

  onBeforeUnmount(() => {
    session.value = undefined
    clearPreview()
  })

  return {
    activeKeySet,
    activeKeys,
    cancelSelection,
    clearSelection,
    finishSelection,
    hitTest,
    isSelected,
    isSelecting,
    previewKeySet,
    previewKeys,
    selectedKeySet,
    selectedKeys,
    selectedTargets,
    selectionRect,
    selectionStyle,
    setSelectedKeys,
    startSelection,
    toggleSelectedKey,
  }
}
