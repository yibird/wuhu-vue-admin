import { computed, watch } from 'vue'
import { createSharedComposable, usePreferredDark } from '@vueuse/core'
import { theme as antTheme } from 'antdv-next'
import { useAppStore } from '@/store'
import { fontFamilyOptions } from '@/config'
import { formatRgbColor, rgbToHex } from '@/utils'
import { THEME_MODE, type ThemeMode, type FontFamily } from '@/constants'
import { useThemeTransition } from './use-theme-transition'
import {
  DEFAULT_PRIMARY_COLOR,
  GREY_MODE_CLASS_NAME,
  PRIMARY_COLOR_VAR,
  THEME_TRANSITION_CLASS,
  WEALMESS_MODE_CLASS_NAME,
} from './constant'

function setThemeMode(mode: 'light' | 'dark') {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
  root.classList.toggle(THEME_MODE.Dark, mode === THEME_MODE.Dark)
}

function setPrimaryColor(color: string) {
  document.documentElement.style.setProperty(
    PRIMARY_COLOR_VAR,
    formatRgbColor(color, ' ')
  )
}

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

export const useTheme = createSharedComposable(() => {
  const { app } = useAppStore()
  const systemDark = usePreferredDark()
  const appThemeMode = computed(() => app.value.themeMode)

  const themeMode = computed(() => {
    if (appThemeMode.value !== THEME_MODE.Auto) return appThemeMode.value
    return systemDark.value ? THEME_MODE.Dark : THEME_MODE.Light
  })
  const themeColor = computed(() => app.value.themeColor)
  const fontFamily = computed(() => app.value.fontFamily)
  const fontOption = computed(
    () =>
      fontFamilyOptions.find((item) => item.value === fontFamily.value) ??
      fontFamilyOptions[0]
  )
  const fontStack = computed(() => fontOption.value.stack)
  const fontWeight = computed(() => fontOption.value.fontWeight)
  const primaryColor = computed(() => {
    return rgbToHex(themeColor.value) ?? DEFAULT_PRIMARY_COLOR
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
        fontFamily: fontStack.value,
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

  const changeFontFamily = (font: FontFamily) => {
    if (app.value.fontFamily === font) return
    app.value.fontFamily = font
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
  watch(
    fontOption,
    (option) => {
      document.documentElement.dataset.font = option.value
    },
    { immediate: true }
  )

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
    fontFamily,
    fontStack,
    fontWeight,
    changeThemeMode,
    changeThemeColor,
    changeFontFamily,
    changeColourWeakness,
    changeGreyMode,
    toggleColourWeakness,
    toggleGreyMode,
    toggleThemeWithAnimation,
  }
})
