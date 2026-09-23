import { computed, shallowRef, watch } from 'vue'
import {
  createSharedComposable,
  useColorMode,
  useEventListener,
} from '@vueuse/core'
import { theme as antTheme } from 'antdv-next'
import { useAppStore } from '@/store'
import { fontFamilyOptions } from '@/config'
import { formatRgbColor, rgbToHex } from '@/utils'
import { useThemeTransition } from './use-theme-transition'
import { ThemeMode } from '@/constants'
import { useVisualMode } from './use-visual-mode'
import type { BasicColorMode, BasicColorSchema } from '@vueuse/core'

const PRIMARY_COLOR_CSS_VAR = '--w-color-primary'
const DEFAULT_PRIMARY_HEX = '#1677ff'
const DEFAULT_PRIMARY_RGB = '22 119 255'

type ResolvedThemeMode = typeof ThemeMode.Light | typeof ThemeMode.Dark

function setPrimaryColor(color: string) {
  document.documentElement.style.setProperty(
    PRIMARY_COLOR_CSS_VAR,
    formatRgbColor(color, ' ') ?? DEFAULT_PRIMARY_RGB
  )
}

function applyRootTheme(mode: ResolvedThemeMode) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
  root.classList.toggle(ThemeMode.Dark, mode === ThemeMode.Dark)
}

function getSystemTheme(): ResolvedThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ThemeMode.Dark
    : ThemeMode.Light
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
    onChanged(mode) {
      applyRootTheme(mode)
    },
  })

  const appThemeMode = computed(() => app.value.themeMode)

  /**
   * 当前实际主题
   * auto 会解析成 light/dark
   */
  const themeMode = computed<ResolvedThemeMode>(() => {
    if (appThemeMode.value === ThemeMode.Auto) {
      return colorMode.system.value
    }

    return appThemeMode.value
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
  const primaryColor = computed(
    () => rgbToHex(themeColor.value) ?? DEFAULT_PRIMARY_HEX
  )
  const themeConfig = computed(() => {
    const colorPrimary = `rgb(${themeColor.value})`
    const isDark = themeMode.value === ThemeMode.Dark
    return {
      algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary,
        colorLink: colorPrimary,
        borderRadius: app.value.borderRadius,
        fontFamily: fontStack.value,
      },
    }
  })

  useVisualMode()

  function changeThemeMode(mode: (typeof ThemeMode)[keyof typeof ThemeMode]) {
    if (app.value.themeMode === mode) return
    app.value.themeMode = mode
  }

  function changeThemeColor(color: string) {
    app.value.themeColor = color
  }

  function changeFontFamily(font: (typeof fontFamilyOptions)[number]['value']) {
    if (app.value.fontFamily === font) return
    app.value.fontFamily = font
  }

  const { changeThemeWithAnimation } = useThemeTransition({
    appThemeMode: () => appThemeMode.value,
    resolvedThemeMode: () => themeMode.value,
    changeThemeMode,
  })

  function toggleThemeMode() {
    changeThemeMode(
      themeMode.value === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
    )
  }

  watch(
    () => app.value.themeMode,
    (mode) => (colorModeRef.value = mode),
    {
      immediate: true,
    }
  )

  watch(themeColor, (color) => setPrimaryColor(color), {
    immediate: true,
  })

  watch(
    fontOption,
    (option) => {
      document.documentElement.dataset.font = option.value
    },
    {
      immediate: true,
    }
  )

  const media = window.matchMedia('(prefers-color-scheme: dark)')

  useEventListener(media, 'change', () => {
    if (app.value.themeMode === ThemeMode.Auto) {
      colorModeRef.value = getSystemTheme()
    }
  })

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
    changeThemeWithAnimation,
    toggleThemeMode,
  }
})
