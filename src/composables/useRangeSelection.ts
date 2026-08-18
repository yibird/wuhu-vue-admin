import { useEventListener } from '@vueuse/core'
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  toValue,
  watch,
  type CSSProperties,
  type MaybeRef,
} from 'vue'

/** 框选碰撞检测方式。 */
export type RangeSelectionStrategy = 'intersect' | 'contain'

/** 框选区域在容器内容坐标系中的矩形信息。 */
export interface RangeSelectionRect {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}

/**
 * 框选组合式 API 的配置。
 *
 * `T` 应该是 HTMLElement 或 HTMLElement 的子类型，因为组合式需要从
 * target 读取 DOM 几何信息。业务数据可以通过 `getKey` 与元素建立稳定关联。
 */
export interface UseRangeSelectionOptions<T = HTMLElement> {
  /** 框选容器。坐标和滚动位置以该元素为基准。 */
  container: MaybeRef<HTMLElement | null>

  /** 可被选择的元素。 */
  targets: MaybeRef<T[]>

  /** 元素选择状态。只作为初始值和外部同步来源，不会直接修改传入 ref。 */
  selected?: MaybeRef<T[]>

  /** 元素唯一标识。未提供时使用元素对象引用进行去重。 */
  getKey?: (target: T) => string | number

  /** 碰撞检测方式。 */
  strategy?: RangeSelectionStrategy

  /** 是否支持 Ctrl / Cmd 追加选择。 */
  multiple?: boolean

  /** 是否启用框选。 */
  enabled?: boolean

  /** 最小拖动距离，用于防止点击误触。默认值为 6px。 */
  threshold?: number

  /** 是否阻止框选过程中的默认行为。默认值为 true。 */
  preventDefault?: boolean

  /** 是否监听滚动并重新计算目标矩形。默认值为 false。 */
  observeScroll?: boolean

  /** 选择变化时触发。 */
  onChange?: (selected: T[]) => void

  /** 开始框选时触发。 */
  onStart?: (event: PointerEvent) => void

  /** 框选过程触发。rect 使用容器内容坐标。 */
  onSelecting?: (rect: DOMRect, selected: T[]) => void

  /** 结束框选时触发。 */
  onEnd?: (selected: T[]) => void
}

interface RangeSelectionPoint {
  x: number
  y: number
}

interface RangeSelectionSession<T> {
  baseSelected: T[]
  captureTarget: HTMLElement
  current: RangeSelectionPoint
  lastClientX: number
  lastClientY: number
  pointerId: number
  snapshots: RangeSelectionTargetSnapshot<T>[]
  start: RangeSelectionPoint
}

interface RangeSelectionTargetSnapshot<T> {
  element: HTMLElement
  rect: RangeSelectionRect
  target: T
}

type RangeSelectionKey<T> = T | string | number

const DEFAULT_THRESHOLD = 6
const DEFAULT_IGNORE_SELECTOR =
  'button, a, input, textarea, select, option, [contenteditable="true"], [data-range-selection-ignore]'

function isElement(target: EventTarget | null): target is Element {
  return target instanceof Element
}

function isHTMLElement<T>(target: T): target is T & HTMLElement {
  return target instanceof HTMLElement
}

function isInteractiveTarget(target: EventTarget | null) {
  return isElement(target) && !!target.closest(DEFAULT_IGNORE_SELECTOR)
}

function createRect(
  start: RangeSelectionPoint,
  current: RangeSelectionPoint
): RangeSelectionRect {
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

function intersects(a: RangeSelectionRect, b: RangeSelectionRect) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  )
}

function contains(a: RangeSelectionRect, b: RangeSelectionRect) {
  return (
    a.left <= b.left &&
    a.right >= b.right &&
    a.top <= b.top &&
    a.bottom >= b.bottom
  )
}

function toDomRect(rect: RangeSelectionRect) {
  return new DOMRect(rect.left, rect.top, rect.width, rect.height)
}

function uniqueTargets<T>(
  targets: readonly T[],
  getKey: (target: T) => RangeSelectionKey<T>
) {
  const seen = new Set<RangeSelectionKey<T>>()
  return targets.filter((target) => {
    const key = getKey(target)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function sameTargets<T>(
  previous: readonly T[],
  next: readonly T[],
  getKey: (target: T) => RangeSelectionKey<T>
) {
  if (previous.length !== next.length) return false
  return previous.every(
    (target, index) => getKey(target) === getKey(next[index])
  )
}

/**
 * 提供通用的鼠标/触摸框选能力。
 *
 * 组合式负责指针事件、碰撞检测、滚动重算、RAF 合帧和资源清理，
 * 不负责节点复制、删除或业务数据更新。调用方通过 onChange/onEnd
 * 将选中的元素转换为自己的业务标识。
 */
export function useRangeSelection<T = HTMLElement>(
  options: UseRangeSelectionOptions<T>
) {
  const getKey = (target: T): RangeSelectionKey<T> =>
    options.getKey?.(target) ?? target
  const selectedState = shallowRef<T[]>(
    uniqueTargets(toValue(options.selected) ?? [], getKey)
  )
  const previewState = shallowRef<T[]>([])
  const session = shallowRef<RangeSelectionSession<T>>()
  const selectionRect = shallowRef<RangeSelectionRect | null>(null)

  let frameId: number | undefined
  let pendingPoint: { clientX: number; clientY: number } | undefined
  let shouldRefreshTargets = false

  /** 当前是否正在框选。 */
  const isSelecting = computed(() => !!session.value)
  /** 已提交的选择结果。 */
  const selected = computed(() => selectedState.value)
  /** 框选过程中的临时选择结果。 */
  const previewSelected = computed(() => previewState.value)
  /** 框选过程中使用预览结果，否则使用已提交结果。 */
  const activeSelected = computed(() =>
    session.value ? previewState.value : selectedState.value
  )
  /** 可直接绑定到容器内容层的框选浮层样式。位置使用 transform。 */
  const selectionStyle = computed<CSSProperties>(() => {
    const rect = selectionRect.value
    if (!rect) return {}

    return {
      height: `${rect.height}px`,
      transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
      width: `${rect.width}px`,
    }
  })

  function getContainer() {
    return toValue(options.container)
  }

  function getTargetElements() {
    return toValue(options.targets).filter((target) => isHTMLElement(target))
  }

  function isWithinTarget(target: EventTarget | null) {
    if (!isElement(target)) return false
    return getTargetElements().some(
      (element) => element === target || element.contains(target)
    )
  }

  function getPoint(event: Pick<PointerEvent, 'clientX' | 'clientY'>) {
    const container = getContainer()
    if (!container) return undefined

    const containerRect = container.getBoundingClientRect()
    return {
      x: event.clientX - containerRect.left + container.scrollLeft,
      y: event.clientY - containerRect.top + container.scrollTop,
    }
  }

  function readTargetSnapshots(): RangeSelectionTargetSnapshot<T>[] {
    const container = getContainer()
    if (!container) return []

    const containerRect = container.getBoundingClientRect()
    const scrollLeft = container.scrollLeft
    const scrollTop = container.scrollTop

    return getTargetElements().map((element) => {
      const elementRect = element.getBoundingClientRect()
      const left = elementRect.left - containerRect.left + scrollLeft
      const top = elementRect.top - containerRect.top + scrollTop
      const target = element as T

      return {
        element,
        rect: {
          bottom: top + elementRect.height,
          height: elementRect.height,
          left,
          right: left + elementRect.width,
          top,
          width: elementRect.width,
          x: left,
          y: top,
        },
        target,
      }
    })
  }

  function mergeTargets(...groups: readonly T[][]) {
    return uniqueTargets(groups.flat(), getKey)
  }

  function getSelectedByRect(
    snapshots: readonly RangeSelectionTargetSnapshot<T>[],
    rect: RangeSelectionRect
  ) {
    const strategy = options.strategy ?? 'intersect'
    return snapshots
      .filter((snapshot) =>
        strategy === 'contain'
          ? contains(rect, snapshot.rect)
          : intersects(rect, snapshot.rect)
      )
      .map((snapshot) => snapshot.target)
  }

  function hasMoved(rect: RangeSelectionRect) {
    const threshold = Math.max(0, options.threshold ?? DEFAULT_THRESHOLD)
    return Math.hypot(rect.width, rect.height) >= threshold
  }

  function releasePointerCapture(currentSession: RangeSelectionSession<T>) {
    const target = currentSession.captureTarget
    try {
      if (!target.hasPointerCapture(currentSession.pointerId)) return
      target.releasePointerCapture(currentSession.pointerId)
    } catch {
      // 元素可能已在卸载或拖拽过程中被移除。
    }
  }

  function setPointerCapture(event: PointerEvent, target: HTMLElement) {
    try {
      target.setPointerCapture(event.pointerId)
    } catch {
      // 触摸模拟器或测试环境可能不支持 pointer capture。
    }
  }

  function applyCommittedSelection(next: T[]) {
    const normalized = uniqueTargets(next, getKey)
    const changed = !sameTargets(selectedState.value, normalized, getKey)
    selectedState.value = normalized
    if (changed) options.onChange?.([...normalized])
  }

  function updatePreview() {
    const currentSession = session.value
    if (!currentSession) return

    if (shouldRefreshTargets) {
      currentSession.snapshots = readTargetSnapshots()
      shouldRefreshTargets = false
    }

    const rect = createRect(currentSession.start, currentSession.current)
    const selectedByRect = hasMoved(rect)
      ? getSelectedByRect(currentSession.snapshots, rect)
      : []
    const nextSelected = mergeTargets(
      currentSession.baseSelected,
      selectedByRect
    )
    selectionRect.value = rect
    previewState.value = nextSelected
    options.onSelecting?.(toDomRect(rect), [...nextSelected])
  }

  function cancelFrame() {
    if (frameId === undefined) return
    window.cancelAnimationFrame(frameId)
    frameId = undefined
  }

  function requestFrame() {
    if (frameId !== undefined || typeof window === 'undefined') return
    frameId = window.requestAnimationFrame(() => {
      frameId = undefined
      const currentSession = session.value
      const point = pendingPoint
      pendingPoint = undefined
      if (!currentSession || !point) return

      const nextPoint = getPoint(point)
      if (!nextPoint) return
      currentSession.current = nextPoint
      updatePreview()
    })
  }

  function handlePointerDown(event: PointerEvent) {
    if (options.enabled === false || event.button !== 0 || session.value) return
    const container = getContainer()
    if (
      !container ||
      isInteractiveTarget(event.target) ||
      isWithinTarget(event.target)
    ) {
      return
    }

    const start = getPoint(event)
    if (!start) return

    options.onStart?.(event)
    const currentSelected = selectedState.value
    const baseSelected =
      options.multiple && (event.ctrlKey || event.metaKey)
        ? [...currentSelected]
        : []

    const currentSession: RangeSelectionSession<T> = {
      baseSelected,
      captureTarget: container,
      current: start,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      pointerId: event.pointerId,
      snapshots: readTargetSnapshots(),
      start,
    }

    session.value = currentSession
    selectionRect.value = createRect(start, start)
    previewState.value = baseSelected
    setPointerCapture(event, container)

    if (options.preventDefault ?? true) event.preventDefault()
  }

  function handlePointerMove(event: PointerEvent) {
    const currentSession = session.value
    if (!currentSession || currentSession.pointerId !== event.pointerId) return

    currentSession.lastClientX = event.clientX
    currentSession.lastClientY = event.clientY
    pendingPoint = { clientX: event.clientX, clientY: event.clientY }
    requestFrame()

    if (options.preventDefault ?? true) event.preventDefault()
  }

  function finishSelection(event: PointerEvent) {
    const currentSession = session.value
    if (!currentSession || currentSession.pointerId !== event.pointerId) return

    cancelFrame()
    pendingPoint = { clientX: event.clientX, clientY: event.clientY }
    const point = getPoint(event)
    if (point) {
      currentSession.current = point
      updatePreview()
    }

    const rect = selectionRect.value
    const nextSelected =
      rect && hasMoved(rect)
        ? [...previewState.value]
        : currentSession.baseSelected

    session.value = undefined
    selectionRect.value = null
    previewState.value = []
    pendingPoint = undefined
    releasePointerCapture(currentSession)
    applyCommittedSelection(nextSelected)
    options.onEnd?.([...uniqueTargets(nextSelected, getKey)])

    if (options.preventDefault ?? true) event.preventDefault()
  }

  function cancelSelection(event?: PointerEvent) {
    const currentSession = session.value
    if (
      event &&
      currentSession &&
      event.pointerId !== currentSession.pointerId
    ) {
      return
    }
    cancelFrame()
    pendingPoint = undefined
    shouldRefreshTargets = false
    if (currentSession) releasePointerCapture(currentSession)
    session.value = undefined
    selectionRect.value = null
    previewState.value = []
  }

  /** 清空已提交的选择，并触发一次选择变化回调。 */
  function clearSelection() {
    cancelSelection()
    applyCommittedSelection([])
  }

  function handleScroll() {
    if (!session.value || !options.observeScroll) return
    shouldRefreshTargets = true
    pendingPoint = {
      clientX: session.value.lastClientX,
      clientY: session.value.lastClientY,
    }
    requestFrame()
  }

  watch(
    () => toValue(options.selected),
    (nextSelected) => {
      if (session.value) return
      selectedState.value = uniqueTargets(nextSelected ?? [], getKey)
    },
    { flush: 'sync' }
  )

  useEventListener(() => getContainer(), 'pointerdown', handlePointerDown)
  useEventListener(window, 'pointermove', handlePointerMove, {
    capture: true,
  })
  useEventListener(window, 'pointerup', finishSelection, { capture: true })
  useEventListener(window, 'pointercancel', cancelSelection, { capture: true })

  if (options.observeScroll) {
    useEventListener(() => getContainer(), 'scroll', handleScroll, {
      passive: true,
    })
    useEventListener(window, 'scroll', handleScroll, {
      capture: true,
      passive: true,
    })
  }

  onBeforeUnmount(() => {
    cancelSelection()
  })

  return {
    activeSelected,
    cancelSelection,
    clearSelection,
    finishSelection,
    isSelecting,
    previewSelected,
    selected,
    selectionRect: computed(() => selectionRect.value),
    selectionStyle,
    startSelection: handlePointerDown,
  }
}
