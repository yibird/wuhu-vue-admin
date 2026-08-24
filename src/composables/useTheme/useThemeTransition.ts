import { nextTick } from 'vue'
import { ThemeMode, type ThemeModeType } from '@/constants'

const THEME_VIEW_TRANSITION_DURATION = 450
const THEME_TRANSITION_CLASS = 'w-theme-transitioning'

type ResolvedThemeMode = Exclude<ThemeModeType, typeof ThemeMode.Auto>

const prefersReducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

function getSystemTheme(): ResolvedThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ThemeMode.Dark
    : ThemeMode.Light
}

function resolveThemeMode(mode: ThemeModeType): ResolvedThemeMode {
  return mode === ThemeMode.Auto ? getSystemTheme() : mode
}

function applyRootTheme(mode: ResolvedThemeMode) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
  root.classList.toggle(ThemeMode.Dark, mode === ThemeMode.Dark)
}

function cancelThemeAnimations(root: HTMLElement) {
  root.getAnimations().forEach((animation) => {
    const pseudoElement = (animation.effect as KeyframeEffect | null)
      ?.pseudoElement
    if (
      pseudoElement === '::view-transition-old(root)' ||
      pseudoElement === '::view-transition-new(root)'
    ) {
      animation.cancel()
    }
  })
}

function getTransitionOrigin(event: Event) {
  if (event instanceof MouseEvent && event.detail > 0) {
    return {
      x: event.clientX,
      y: event.clientY,
    }
  }

  if (event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }
}

function createThemeClipPath(x: number, y: number) {
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  return [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`,
  ]
}

export function useThemeTransition(options: {
  appThemeMode: () => ThemeModeType
  resolvedThemeMode: () => ResolvedThemeMode
  changeThemeMode: (mode: ThemeModeType) => void
}) {
  let transitioning = false
  async function changeThemeWithAnimation(event: Event, mode: ThemeModeType) {
    if (transitioning || options.appThemeMode() === mode) {
      return
    }

    const targetMode = resolveThemeMode(mode)
    const canAnimate = typeof document.startViewTransition === 'function'

    if (
      prefersReducedMotionQuery?.matches ||
      !canAnimate ||
      options.resolvedThemeMode() === targetMode
    ) {
      options.changeThemeMode(mode)
      return
    }

    transitioning = true
    const root = document.documentElement
    const { x, y } = getTransitionOrigin(event)
    const isDark = targetMode === ThemeMode.Dark
    let transition: ViewTransition | undefined
    let animation: Animation | undefined
    try {
      cancelThemeAnimations(root)
      root.classList.add(THEME_TRANSITION_CLASS)
      transition = document.startViewTransition(async () => {
        applyRootTheme(targetMode)
        options.changeThemeMode(mode)
        await nextTick()
      })

      await transition.ready

      if (typeof root.animate === 'function') {
        const clipPath = createThemeClipPath(x, y)
        animation = root.animate(
          {
            clipPath: isDark ? clipPath.reverse() : clipPath,
          },
          {
            duration: THEME_VIEW_TRANSITION_DURATION,
            easing: 'ease-in',
            fill: 'forwards',
            pseudoElement: isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          }
        )
      }

      await Promise.allSettled([transition.finished, animation?.finished])
    } catch {
      transition?.skipTransition()
    } finally {
      animation?.cancel()
      root.classList.remove(THEME_TRANSITION_CLASS)
      transitioning = false
    }
  }

  return {
    changeThemeWithAnimation,
  }
}
