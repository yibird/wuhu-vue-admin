import { computed, watch } from 'vue'
import { createSharedComposable, usePreferredDark } from '@vueuse/core'
import { theme as antTheme, type ThemeConfig } from 'antdv-next'
import { isEqual } from 'es-toolkit'
import { useAppStore } from '@/store'
import { THEME_MODE, type ThemeMode } from '@/constants'
import { useThemeTransition } from './use-theme-transition'
import {
  resolveThemeMode,
  setAntdTheme,
  setColorFilters,
  setFont,
  setPrimaryColor,
  setThemeMode,
  withoutColorTransition,
} from './util'
import { DEFAULT_PRIMARY_COLOR } from './constant'
import type { Font } from '#/config'

export const useTheme = createSharedComposable(() => {
  const isDark = usePreferredDark()
  const { app } = useAppStore()

  const appThemeMode = computed(() => app.value.themeMode)
  const themeMode = computed(() =>
    resolveThemeMode(appThemeMode.value, isDark.value)
  )
  const themeColor = computed(
    () => app.value.themeColor || DEFAULT_PRIMARY_COLOR
  )
  const font = computed(() => app.value.font)
  const primaryColor = computed(() => `rgb(${themeColor.value})`)

  const themeConfig = computed<ThemeConfig>(() => ({
    algorithm:
      themeMode.value === THEME_MODE.Dark
        ? antTheme.darkAlgorithm
        : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor.value,
      colorLink: primaryColor.value,
      borderRadius: app.value.borderRadius,
      fontFamily: font.value?.stack,
    },
  }))

  const changeThemeMode = (mode: ThemeMode) => {
    if (app.value.themeMode === mode) return
    app.value.themeMode = mode
  }
  const changeThemeColor = (themeColor: string) => {
    if (app.value.themeColor === themeColor) return
    app.value.themeColor = themeColor
  }
  const changeFont = (font: Font) => {
    if (isEqual(app.value.font, font)) return
    app.value.font = { ...font }
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
  watch(themeConfig, setAntdTheme, { flush: 'sync', immediate: true })
  watch(
    () => [app.value.colourWeakness, app.value.greyMode],
    ([colourWeakness, greyMode]) => {
      setColorFilters(colourWeakness, greyMode)
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
