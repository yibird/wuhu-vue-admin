import { onScopeDispose, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { usePreferredReducedMotion, useResizeObserver } from '@vueuse/core'

const ITEM_SELECTOR = '[data-tab-key]'
const WRAPPER_SELECTOR = '.layout-tabs-list__wrapper'
const SCROLL_TOLERANCE = 1

type Target = MaybeRefOrGetter<HTMLElement | null | undefined>
type ActiveKey = MaybeRefOrGetter<string | null | undefined>
type RollDirection = -1 | 1

interface HorizontalViewport {
  left: number
  width: number
  maxLeft: number
}

interface HorizontalItemBounds {
  left: number
  right: number
}

function clampScrollLeft(left: number, maxLeft: number) {
  return Math.max(0, Math.min(left, maxLeft))
}

export function resolveNearestScrollLeft(
  viewport: HorizontalViewport,
  item: HorizontalItemBounds,
  tolerance = SCROLL_TOLERANCE
) {
  const itemWidth = item.right - item.left
  const visibleRight = viewport.left + viewport.width
  let candidateLeft: number

  if (itemWidth >= viewport.width - tolerance) {
    candidateLeft = item.left
  } else if (item.left < viewport.left - tolerance) {
    candidateLeft = item.left
  } else if (item.right > visibleRight + tolerance) {
    candidateLeft = item.right - viewport.width
  } else {
    return undefined
  }

  const nextLeft = clampScrollLeft(candidateLeft, viewport.maxLeft)
  return Math.abs(nextLeft - viewport.left) > tolerance ? nextLeft : undefined
}

function readViewport(element: HTMLElement): HorizontalViewport | undefined {
  const width = element.clientWidth
  if (width <= 0) return undefined

  return {
    left: element.scrollLeft,
    width,
    maxLeft: Math.max(0, element.scrollWidth - width),
  }
}

function findTabElement(element: HTMLElement, key: string) {
  return element.querySelector<HTMLElement>(
    `${ITEM_SELECTOR}[data-tab-key="${CSS.escape(key)}"]`
  )
}

function scrollToActiveTab(
  target: Target,
  activeKey: ActiveKey,
  behavior: ScrollBehavior
) {
  const targetEl = toValue(target)
  const key = toValue(activeKey)
  if (!targetEl || !key) return

  const viewport = readViewport(targetEl)
  const item = findTabElement(targetEl, key)
  if (!viewport || !item) return

  const nextLeft = resolveNearestScrollLeft(viewport, {
    left: item.offsetLeft,
    right: item.offsetLeft + item.offsetWidth,
  })
  if (nextLeft === undefined) return

  targetEl.scrollTo({ left: nextLeft, behavior })
}

/**
 * Keeps the active tab visible while preserving native horizontal scrolling.
 */
export function useRoll(target: Target, activeKey: ActiveKey) {
  let scheduledFrameId: number | undefined
  const preferredMotion = usePreferredReducedMotion()
  const scrollBehavior = () =>
    preferredMotion.value === 'reduce' ? 'auto' : 'smooth'

  const cancelScheduledRoll = () => {
    if (scheduledFrameId === undefined) return
    cancelAnimationFrame(scheduledFrameId)
    scheduledFrameId = undefined
  }

  const scheduleActiveRoll = () => {
    cancelScheduledRoll()

    const roll = () => {
      scheduledFrameId = undefined
      scrollToActiveTab(target, activeKey, scrollBehavior())
    }

    if (typeof requestAnimationFrame === 'undefined') {
      roll()
      return
    }

    scheduledFrameId = requestAnimationFrame(roll)
  }

  const rollPage = (direction: RollDirection) => {
    const targetEl = toValue(target)
    if (!targetEl) return

    const viewport = readViewport(targetEl)
    if (!viewport) return

    const nextLeft = clampScrollLeft(
      viewport.left + viewport.width * direction,
      viewport.maxLeft
    )
    if (Math.abs(nextLeft - viewport.left) <= SCROLL_TOLERANCE) return

    targetEl.scrollTo({
      left: nextLeft,
      behavior: scrollBehavior(),
    })
  }

  watch([() => toValue(target), () => toValue(activeKey)], scheduleActiveRoll, {
    immediate: true,
    flush: 'post',
  })

  useResizeObserver(() => {
    const targetEl = toValue(target)
    if (!targetEl) return []

    const wrapper = targetEl.querySelector<HTMLElement>(WRAPPER_SELECTOR)
    return wrapper ? [targetEl, wrapper] : [targetEl]
  }, scheduleActiveRoll)

  onScopeDispose(cancelScheduledRoll)

  return {
    rollLeft: () => rollPage(-1),
    rollRight: () => rollPage(1),
  }
}
