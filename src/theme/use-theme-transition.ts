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
   * @desc 读取当前实际生效的主题
   */
  currentThemeMode: () => typeof THEME_MODE.Light | typeof THEME_MODE.Dark
  /**
   * @desc 写入主题模式(通常是 store action)
   */
  changeThemeMode: (mode: ThemeMode) => void
}

/**
 * 取揭示起点:鼠标点击用点击坐标,键盘触发用元素中心,都取不到时用视口中心
 *
 * @param event 触发事件
 */
function getTransitionOrigin(event: Event) {
  const maxX = window.innerWidth
  const maxY = window.innerHeight
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
 * 生成覆盖整个视口的圆形裁剪关键帧
 *
 * 切到暗色时旧快照从大圆收缩,切到亮色时新快照从小圆展开。
 *
 * @param x 圆心横坐标
 * @param y 圆心纵坐标
 * @param isDark 是否切到暗色
 */
function createClipPathKeyframes(x: number, y: number, isDark: boolean) {
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  const collapsed = `circle(0px at ${x}px ${y}px)`
  const expanded = `circle(${radius}px at ${x}px ${y}px)`

  return isDark ? [expanded, collapsed] : [collapsed, expanded]
}

/**
 * 取消上一次未完成的揭示动画,避免重复点击时新旧动画叠加
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
 * 创建圆形揭示动画;根节点不支持 animate 时返回 undefined
 *
 * @param root 根节点
 * @param origin 揭示起点
 * @param isDark 是否切到暗色
 */
function createRevealAnimation(
  root: HTMLElement,
  origin: { x: number; y: number },
  isDark: boolean
) {
  if (typeof root.animate !== 'function') return undefined

  return root.animate(
    { clipPath: createClipPathKeyframes(origin.x, origin.y, isDark) },
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

/**
 * 主题切换过渡动画
 */
export function useThemeTransition(options: UseThemeTransitionOptions) {
  let transitioning = false

  /**
   * 带揭示动画地切换到指定主题
   *
   * @param event 触发事件,用于确定揭示起点
   * @param mode 目标主题
   */
  async function revealTo(
    event: Event,
    mode: typeof THEME_MODE.Light | typeof THEME_MODE.Dark
  ) {
    if (transitioning || options.currentThemeMode() === mode) return
    if (typeof document.startViewTransition !== 'function') {
      options.changeThemeMode(mode)
      return
    }

    transitioning = true
    const root = document.documentElement
    const origin = getTransitionOrigin(event)
    const isDark = mode === THEME_MODE.Dark
    let transition: ViewTransition | undefined
    let animation: Animation | undefined

    try {
      cancelAnimations(root)
      root.classList.toggle(THEME_TRANSITION_CLASS, true)
      transition = document.startViewTransition(async () => {
        options.changeThemeMode(mode)
        await nextTick()
      })
      await transition.ready

      animation = createRevealAnimation(root, origin, isDark)
      await Promise.allSettled([transition.finished, animation?.finished])
    } catch {
      transition?.skipTransition()
      options.changeThemeMode(mode)
    } finally {
      animation?.cancel()
      root.classList.toggle(THEME_TRANSITION_CLASS, false)
      transitioning = false
    }
  }

  /**
   * 在明暗主题之间切换(带揭示动画)
   *
   * @param event 触发事件
   */
  function toggleThemeWithAnimation(event: Event) {
    const targetMode =
      options.currentThemeMode() === THEME_MODE.Dark
        ? THEME_MODE.Light
        : THEME_MODE.Dark
    return revealTo(event, targetMode)
  }

  return {
    toggleThemeWithAnimation,
  }
}
