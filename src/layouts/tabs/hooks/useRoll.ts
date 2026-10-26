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

/**
 * 计算把当前激活 Tab 滚入视野所需的目标位置
 *
 * @returns 需要滚动时返回容器与目标 scrollLeft,否则 undefined
 */
function getRevealTarget(target: Target, activeKey: ActiveKey) {
  const targetEl = toValue(target)
  const key = toValue(activeKey)
  if (!targetEl || !key) return undefined

  const viewport = readViewport(targetEl)
  if (!viewport || viewport.maxLeft <= 0) return undefined

  const item = findTabElement(targetEl, key)
  if (!item) return undefined

  // offsetLeft/offsetWidth 相对 offsetParent,此处约定
  // `.layout-tabs-list__wrapper` 就是该 tab 元素的 offsetParent
  // (依赖 common.less 中 wrapper 的 position: relative)
  const left = getScrollLeftToReveal(viewport, {
    left: item.offsetLeft,
    right: item.offsetLeft + item.offsetWidth,
  })

  return left === undefined ? undefined : { element: targetEl, left }
}

/**
 * Keeps the active tab visible while preserving native horizontal scrolling.
 */
export function useRoll(target: Target, activeKey: ActiveKey) {
  let scheduledFrameId: number | undefined
  let scrollFrameId: number | undefined
  /** 首次定位直接落位,不播放动画 */
  let isFirstRoll = true
  const preferredMotion = usePreferredReducedMotion()

  const cancelScheduledRoll = () => {
    if (scheduledFrameId === undefined) return
    cancelAnimationFrame(scheduledFrameId)
    scheduledFrameId = undefined
  }

  const cancelScrollAnimation = () => {
    if (scrollFrameId === undefined) return
    cancelAnimationFrame(scrollFrameId)
    scrollFrameId = undefined
  }

  /**
   * 用 rAF 动画滚动到目标位置
   *
   * 翻页与 Tab 定位共用:原生 smooth 会被滚动节流或尺寸变化打断,
   * 自绘动画可随时取消,重算时不会留下半程动画。
   */
  const animateScrollTo = (element: HTMLElement, left: number) => {
    cancelScrollAnimation()

    const start = element.scrollLeft
    const distance = left - start
    if (Math.abs(distance) <= SCROLL_TOLERANCE) return

    if (
      preferredMotion.value === 'reduce' ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      element.scrollLeft = left
      return
    }

    const duration = 240
    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - (1 - progress) ** 3
      element.scrollLeft = start + distance * eased
      scrollFrameId = progress < 1 ? requestAnimationFrame(step) : undefined
    }
    scrollFrameId = requestAnimationFrame(step)
  }

  /**
   * 定位到激活 Tab,动画与翻页保持一致
   *
   * @param animate 是否使用动画;首次定位与尺寸变化时直接落位,
   *   避免刷新时整条 Tab 栏可见地滑动、以及窗口缩放中途反复重启动画
   */
  const schedule = (animate: boolean) => {
    cancelScheduledRoll()
    cancelScrollAnimation()

    const roll = () => {
      scheduledFrameId = undefined

      const reveal = getRevealTarget(target, activeKey)
      const shouldAnimate = animate && !isFirstRoll
      isFirstRoll = false
      if (!reveal) return

      if (shouldAnimate) animateScrollTo(reveal.element, reveal.left)
      else reveal.element.scrollLeft = reveal.left
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

    animateScrollTo(targetEl, nextLeft)
  }

  // 切换激活 Tab 时带动画滚入视野
  watch(
    [() => toValue(target), () => toValue(activeKey)],
    () => schedule(true),
    {
      immediate: true,
      flush: 'post',
    }
  )

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
      // 尺寸变化只在必要时重定位,不播放动画
      if (widthChanged) schedule(false)
    }
  )

  // 用户手动滚动时立即停止翻页动画,避免与手势争夺 scrollLeft
  watch(
    () => toValue(target),
    (targetEl, _, onCleanup) => {
      if (!targetEl) return
      targetEl.addEventListener('wheel', cancelScrollAnimation, {
        passive: true,
      })
      targetEl.addEventListener('touchstart', cancelScrollAnimation, {
        passive: true,
      })
      onCleanup(() => {
        targetEl.removeEventListener('wheel', cancelScrollAnimation)
        targetEl.removeEventListener('touchstart', cancelScrollAnimation)
      })
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    cancelScheduledRoll()
    cancelScrollAnimation()
  })

  return {
    rollLeft: () => rollPage(-1),
    rollRight: () => rollPage(1),
  }
}
