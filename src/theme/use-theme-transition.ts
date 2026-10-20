import { nextTick } from 'vue'
import { THEME_MODE, type ThemeMode } from '@/constants'
import {
  VIEW_TRANSITION_PSEUDO_OLD,
  VIEW_TRANSITION_PSEUDO_NEW,
  DEFAULT_DURATION,
  DEFAULT_EASING,
  THEME_TRANSITION_CLASS,
} from './constant'

interface UseThemeTransitionOptions {
  /**
   * @desc 当前实际生效的主题
   */
  currentThemeMode: () => 'light' | 'dark'
  /**
   * @desc 写入主题模式(通常是 store action)
   */
  changeThemeMode: (mode: ThemeMode) => void
}

/**
 * 取主题切换动画的起点
 *
 * 鼠标点击用点击坐标;键盘触发(点击事件 detail 为 0)用元素中心;
 * 都取不到时用视口中心。
 *
 * @param event 触发事件
 */
function getTransitionOrigin(event: Event) {
  const maxX = window.innerWidth,
    maxY = window.innerHeight
  const clamp = (x: number, y: number) => ({
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  })
  if (event instanceof MouseEvent && event.detail > 0) {
    return clamp(event.clientX, event.clientY)
  }
  if (event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect()
    return clamp(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }
  return { x: maxX / 2, y: maxY / 2 }
}

/**
 * 生成覆盖整个视口的圆形裁剪动画关键帧
 *
 * @param x 圆心横坐标
 * @param y 圆心纵坐标
 */
const createThemeClipPath = (x: number, y: number) => {
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  return [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`,
  ]
}

/**
 * 取消上一次未完成的主题揭示动画
 *
 * View Transition 的伪元素动画挂在根节点上,重复点击时需要先清掉,
 * 否则新动画会叠加在旧动画之上。
 *
 * @param root 根节点
 */
function cancelAnimations(root: HTMLElement) {
  for (const animation of root.getAnimations()) {
    if (!(animation.effect instanceof KeyframeEffect)) continue
    const { pseudoElement } = animation.effect
    if (
      pseudoElement === VIEW_TRANSITION_PSEUDO_OLD ||
      pseudoElement === VIEW_TRANSITION_PSEUDO_NEW
    ) {
      animation.cancel()
    }
  }
}

/**
 * 主题切换过渡动画
 *
 * 优先使用 View Transitions + 圆形揭示;不支持或用户开启减少动效时直接切换。
 * 主题本身由 use-theme 的 watcher 写入 DOM,这里只负责动画编排。
 */
export function useThemeTransition(options: UseThemeTransitionOptions) {
  let transitioning = false

  /**
   * 带揭示动画地切换到指定主题
   *
   * @param e 触发事件,用于确定揭示起点
   * @param targetMode 目标主题
   */
  async function revealTo(e: Event, mode: 'light' | 'dark') {
    if (transitioning || options.currentThemeMode() === mode) return
    const canAnimate = typeof document.startViewTransition === 'function'
    if (!canAnimate) {
      options.changeThemeMode(mode)
      return
    }

    transitioning = true
    const root = document.documentElement
    const { x, y } = getTransitionOrigin(e)
    const isDark = mode === THEME_MODE.Dark
    let transition: ViewTransition | undefined
    let animation: Animation | undefined

    try {
      cancelAnimations(root)
      document.documentElement.classList.toggle(THEME_TRANSITION_CLASS, true)
      transition = document.startViewTransition(async () => {
        // 同步 watcher 会把主题写到 DOM,nextTick 等组件把新主题渲染完再拍快照
        options.changeThemeMode(mode)
        await nextTick()
      })

      await transition.ready

      if (typeof root.animate === 'function') {
        const clipPath = createThemeClipPath(x, y)
        animation = root.animate(
          { clipPath: isDark ? clipPath.reverse() : clipPath },
          {
            duration: DEFAULT_DURATION,
            easing: DEFAULT_EASING,
            fill: 'forwards',
            pseudoElement: isDark
              ? VIEW_TRANSITION_PSEUDO_OLD
              : VIEW_TRANSITION_PSEUDO_NEW,
          }
        )
      }

      await Promise.allSettled([transition.finished, animation?.finished])
    } catch {
      transition?.skipTransition()
      // 动画不可用时保证主题本身已经切换
      options.changeThemeMode(mode)
    } finally {
      animation?.cancel()
      document.documentElement.classList.toggle(THEME_TRANSITION_CLASS, false)
      transitioning = false
    }
  }

  /**
   * 在明暗主题之间切换(带揭示动画)
   *
   * @param e 触发事件
   */
  function toggleThemeWithAnimation(e: Event) {
    const targetMode =
      options.currentThemeMode() === THEME_MODE.Dark
        ? THEME_MODE.Light
        : THEME_MODE.Dark
    return revealTo(e, targetMode)
  }

  return {
    toggleThemeWithAnimation,
  }
}
