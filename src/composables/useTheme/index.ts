import { computed, shallowRef, watch } from 'vue'
import { createSharedComposable, useColorMode } from '@vueuse/core'
import { theme as antTheme } from 'antdv-next'
import { useAppStore } from '@/store'
import { formatRgbColor, rgbToHex } from '@/utils'
import { useThemeTransition } from './useThemeTransition'
import { ThemeMode } from '@/constants'
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

  const primaryColor = computed(
    () => rgbToHex(themeColor.value) ?? DEFAULT_PRIMARY_HEX
  )

  /**
   * Ant Design Vue Theme Token
   */
  const themeConfig = computed(() => {
    return {
      algorithm:
        themeMode.value === ThemeMode.Dark
          ? antTheme.darkAlgorithm
          : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: `rgb(${themeColor.value})`,
      },
    }
  })

  function changeThemeMode(mode: (typeof ThemeMode)[keyof typeof ThemeMode]) {
    if (app.value.themeMode === mode) return
    app.value.themeMode = mode
  }

  function changeThemeColor(color: string) {
    app.value.themeColor = color
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

  /**
   * 灰度 / 色弱模式
   */
  watch(
    () => [app.value.colourWeakness, app.value.greyMode],
    ([colourWeakness, greyMode]) => {
      const root = document.documentElement
      root.classList.toggle('color-weakness-mode', Boolean(colourWeakness))
      root.classList.toggle('grey-mode', Boolean(greyMode))
    },
    {
      immediate: true,
    }
  )

  /**
   * 系统主题变化监听
   */
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const onSystemThemeChange = () => {
    if (app.value.themeMode === ThemeMode.Auto) {
      colorModeRef.value = getSystemTheme()
    }
  }

  media.addEventListener('change', onSystemThemeChange)

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
