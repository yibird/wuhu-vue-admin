import { computed, watch } from 'vue'
import { createSharedComposable, usePreferredDark } from '@vueuse/core'
import { theme as antTheme } from 'antdv-next'
import { isEqual } from 'es-toolkit'
import { useAppStore } from '@/store'
import { rgbToHex, toRgb } from '@/utils'
import { THEME_MODE, type ThemeMode } from '@/constants'
import { useThemeTransition } from './use-theme-transition'
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_PRIMARY_HEX,
  GREY_MODE_CLASS_NAME,
  PRIMARY_COLOR_VAR,
  THEME_TRANSITION_CLASS,
  WEALMESS_MODE_CLASS_NAME,
} from './constant'
import type { Font } from '#/config'

/** 待执行的解锁帧,连续切换时只保留最后一次 */
let unlockFrame: number | undefined

function withoutColorTransition(task: () => void) {
  const root = document.documentElement
  const alreadyLocked = root.classList.contains(THEME_TRANSITION_CLASS)
  if (!alreadyLocked) {
    document.documentElement.classList.toggle(THEME_TRANSITION_CLASS, true)
  }
  task()

  if (alreadyLocked) return
  if (unlockFrame !== undefined) cancelAnimationFrame(unlockFrame)
  unlockFrame = requestAnimationFrame(() => {
    unlockFrame = undefined
    document.documentElement.classList.toggle(THEME_TRANSITION_CLASS, false)
  })
}

export function resolveThemeMode(mode: unknown, systemDark: boolean) {
  return mode === THEME_MODE.Dark || (mode === THEME_MODE.Auto && systemDark)
    ? THEME_MODE.Dark
    : THEME_MODE.Light
}

export function setThemeMode(mode: 'light' | 'dark') {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
  root.classList.toggle(THEME_MODE.Dark, mode === THEME_MODE.Dark)
}

export function setPrimaryColor(color: string) {
  document.documentElement.style.setProperty(
    PRIMARY_COLOR_VAR,
    toRgb(color) ?? DEFAULT_PRIMARY_COLOR
  )
}

export function setFont(font: Font) {
  const root = document.documentElement
  root.dataset.font = font.family

  root.style.setProperty('--w-font-family', font.stack!)
  root.style.setProperty('--w-font-weight', font.weight as string)
  root.style.setProperty('--w-letter-spacing', font.letterSpacing!)
}

export const useTheme = createSharedComposable(() => {
  const { app } = useAppStore()
  const systemDark = usePreferredDark()
  const appThemeMode = computed(() => app.value.themeMode)

  const themeMode = computed(() =>
    resolveThemeMode(appThemeMode.value, systemDark.value)
  )
  const themeColor = computed(() => app.value.themeColor)
  const font = computed(() => app.value.font)

  const primaryColor = computed(() => {
    return rgbToHex(themeColor.value) ?? DEFAULT_PRIMARY_HEX
  })
  const isDark = computed(() => themeMode.value === THEME_MODE.Dark)
  const algorithm = computed(() => {
    return isDark.value ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
  })

  const themeConfig = computed(() => {
    return {
      algorithm: algorithm.value,
      token: {
        colorPrimary: primaryColor.value,
        colorLink: primaryColor.value,
        borderRadius: app.value.borderRadius,
        fontFamily: font.value?.family,
      },
    }
  })

  const changeThemeMode = (mode: ThemeMode) => {
    if (app.value.themeMode === mode) return
    app.value.themeMode = mode
  }
  const changeThemeColor = (color: string) => {
    if (app.value.themeColor === color) return
    app.value.themeColor = color
  }

  const changeFont = (font: Font) => {
    if (isEqual(app.value.font, font)) return
    app.value.font = font
  }

  const changeColourWeakness = (colourWeakness: boolean) => {
    app.value.colourWeakness = colourWeakness
  }
  const changeGreyMode = (greyMode: boolean) => {
    app.value.greyMode = greyMode
  }

  const toggleColourWeakness = () => {
    changeColourWeakness(!app.value.colourWeakness)
  }

  const toggleGreyMode = () => {
    changeGreyMode(!app.value.greyMode)
  }

  const { toggleThemeWithAnimation } = useThemeTransition({
    currentThemeMode: () => themeMode.value,
    changeThemeMode,
  })
  setThemeMode(themeMode.value)

  watch(themeMode, (mode) => withoutColorTransition(() => setThemeMode(mode)), {
    flush: 'sync',
  })
  watch(themeColor, setPrimaryColor, { immediate: true })
  watch(font, setFont, { immediate: true })
  watch(
    () => [app.value.colourWeakness, app.value.greyMode],
    ([colourWeakness, greyMode]) => {
      const root = document.documentElement
      root.classList.toggle(WEALMESS_MODE_CLASS_NAME, colourWeakness)
      root.classList.toggle(GREY_MODE_CLASS_NAME, greyMode)
    },
    { immediate: true }
  )

  return {
    themeConfig,
    appThemeMode,
    themeMode,
    themeColor,
    primaryColor,
    font,
    changeThemeMode,
    changeThemeColor,
    changeFont,
    changeColourWeakness,
    changeGreyMode,
    toggleColourWeakness,
    toggleGreyMode,
    toggleThemeWithAnimation,
  }
})
