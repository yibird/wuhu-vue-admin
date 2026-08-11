import { theme as antTheme } from 'antdv-next'
import { computed, nextTick, shallowRef, watch, watchEffect } from 'vue'
import { createSharedComposable, useColorMode } from '@vueuse/core'
import { ThemeMode, type ThemeModeType } from '@/constants'
import { useAppStore } from '@/store'
import { formatRgbColor, rgbToHex } from '@/utils'

import type { BasicColorMode, BasicColorSchema } from '@vueuse/core'

const PRIMARY_COLOR_CSS_VAR = '--w-color-primary'
const DEFAULT_PRIMARY_HEX = '#1890ff'
const DEFAULT_PRIMARY_RGB = '24 144 255'
const THEME_VIEW_TRANSITION_DURATION = 450
const THEME_TRANSITION_CLASS = 'w-theme-transitioning'
type ResolvedThemeMode = Exclude<ThemeModeType, typeof ThemeMode.Auto>

function setCssVar(color: string) {
  document.documentElement.style.setProperty(
    PRIMARY_COLOR_CSS_VAR,
    formatRgbColor(color, ' ') ?? DEFAULT_PRIMARY_RGB
  )
}

function getSystemTheme() {
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

function cancelStaleThemeAnimations(root: HTMLElement) {
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
    return { x: event.clientX, y: event.clientY }
  }
  if (event.currentTarget instanceof HTMLElement) {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect()
    return { x: left + width / 2, y: top + height / 2 }
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

const useThemeTransition = (options: {
  appThemeMode: () => ThemeModeType
  resolvedThemeMode: () => ResolvedThemeMode
  changeThemeMode: (mode: ThemeModeType) => void
}) => {
  let isTransitioning = false
  const changeThemeWithAnimation = async (
    event: Event,
    mode: ThemeModeType
  ) => {
    const { appThemeMode, resolvedThemeMode, changeThemeMode } = options
    if (appThemeMode() === mode || isTransitioning) return
    const targetMode = resolveThemeMode(mode)

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (
      prefersReducedMotion ||
      resolvedThemeMode() === targetMode ||
      typeof document.startViewTransition !== 'function'
    ) {
      changeThemeMode(mode)
      return
    }

    isTransitioning = true

    const root = document.documentElement
    const { x, y } = getTransitionOrigin(event)
    const isDark = targetMode === ThemeMode.Dark

    let transition: ViewTransition | undefined
    let animation: Animation | undefined

    try {
      cancelStaleThemeAnimations(root)
      root.classList.add(THEME_TRANSITION_CLASS)
      transition = document.startViewTransition(async () => {
        applyRootTheme(targetMode)
        changeThemeMode(mode)
        await nextTick()
      })

      await transition.ready

      if (typeof root.animate !== 'function') {
        await transition.finished
        return
      }

      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${radius}px at ${x}px ${y}px)`,
      ]

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
      void animation.finished.catch(() => undefined)
      await transition.finished
    } catch {
      transition?.skipTransition()
    } finally {
      animation?.cancel()
      root.classList.remove(THEME_TRANSITION_CLASS)
      isTransitioning = false
    }
  }
  return { changeThemeWithAnimation }
}

export const useTheme = createSharedComposable(() => {
  const { app } = useAppStore()

  const colorModeRef = shallowRef<BasicColorSchema>(app.value.themeMode)
  const colorMode = useColorMode<BasicColorMode>({
    selector: 'html',
    attribute: 'data-theme',
    storageKey: null,
    storageRef: colorModeRef,
    disableTransition: true,
    onChanged: (mode) => {
      applyRootTheme(mode)
    },
  })

  const appThemeMode = computed(() => app.value.themeMode)
  const themeColor = computed(() => app.value.themeColor)
  const primaryColor = computed(
    () => rgbToHex(themeColor.value) ?? DEFAULT_PRIMARY_HEX
  )
  const themeMode = computed(() =>
    appThemeMode.value === ThemeMode.Auto
      ? colorMode.system.value
      : appThemeMode.value
  )
  const themeConfig = computed(() => ({
    algorithm:
      themeMode.value === ThemeMode.Dark
        ? antTheme.darkAlgorithm
        : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor.value,
      borderRadius: app.value.borderRadius,
      fontFamily: 'var(--w-font-family)',
    },
  }))

  const changeThemeMode = (mode: ThemeModeType) => {
    if (app.value.themeMode === mode) return
    app.value.themeMode = mode
  }

  const changeThemeColor = (themeColor: string) => {
    app.value.themeColor = themeColor
  }

  const { changeThemeWithAnimation } = useThemeTransition({
    appThemeMode: () => appThemeMode.value,
    resolvedThemeMode: () => themeMode.value,
    changeThemeMode,
  })

  const toggleThemeMode = () => {
    const nextThemeMode =
      themeMode.value === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
    changeThemeMode(nextThemeMode)
  }

  watch(
    () => app.value.themeMode,
    (mode) => {
      colorModeRef.value = mode
    }
  )

  watchEffect(() => setCssVar(themeColor.value))

  watchEffect(() => {
    const root = document.documentElement
    root.classList.toggle(
      'color-weakness-mode',
      Boolean(app.value.colourWeakness)
    )
    root.classList.toggle('grey-mode', Boolean(app.value.greyMode))
  })

  return {
    themeConfig,
    appThemeMode,
    themeMode,
    themeColor,
    primaryColor,
    changeThemeMode,
    changeThemeColor,
    changeThemeWithAnimation,
    toggleThemeMode,
  }
})
