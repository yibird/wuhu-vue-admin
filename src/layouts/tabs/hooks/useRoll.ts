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

function getScrollLeftToReveal(
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
  if (!viewport || viewport.maxLeft <= 0) return

  const item = findTabElement(targetEl, key)
  if (!item) return

  // offsetLeft/offsetWidth 相对 offsetParent,此处约定
  // `.layout-tabs-list__wrapper` 就是该 tab 元素的 offsetParent
  // (依赖 common.less 中 wrapper 的 position: relative)
  const nextLeft = getScrollLeftToReveal(viewport, {
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
  /** 仅用户点击箭头翻页时使用平滑滚动 */
  const userScrollBehavior = () =>
    preferredMotion.value === 'reduce' ? 'auto' : 'smooth'

  const cancelScheduledRoll = () => {
    if (scheduledFrameId === undefined) return
    cancelAnimationFrame(scheduledFrameId)
    scheduledFrameId = undefined
  }

  /**
   * 程序化定位使用 auto 滚动:平滑滚动会逐帧改动 scrollLeft,
   * 而视口与内容尺寸变化都会触发定位,动画途中重算会互相打断并持续触发布局。
   */
  const schedule = () => {
    cancelScheduledRoll()

    const roll = () => {
      scheduledFrameId = undefined
      scrollToActiveTab(target, activeKey, 'auto')
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
      behavior: userScrollBehavior(),
    })
  }

  watch([() => toValue(target), () => toValue(activeKey)], schedule, {
    immediate: true,
    flush: 'post',
  })

  /**
   * 上一次观测到的宽度,用于忽略尺寸没变化的重复回调:
   * 观察器建立时会为每个目标各触发一次,且 Tab 增删会同时命中观察器与上面的 watch
   */
  const observedWidths = new WeakMap<Element, number>()

  useResizeObserver(
    () => {
      const targetEl = toValue(target)
      if (!targetEl) return []

      const wrapper = targetEl.querySelector<HTMLElement>(WRAPPER_SELECTOR)
      return wrapper ? [targetEl, wrapper] : [targetEl]
    },
    (entries) => {
      let widthChanged = false
      for (const entry of entries) {
        const width = entry.contentRect.width
        if (observedWidths.get(entry.target) === width) continue
        observedWidths.set(entry.target, width)
        widthChanged = true
      }
      if (widthChanged) schedule()
    }
  )

  onScopeDispose(cancelScheduledRoll)

  return {
    rollLeft: () => rollPage(-1),
    rollRight: () => rollPage(1),
  }
}
