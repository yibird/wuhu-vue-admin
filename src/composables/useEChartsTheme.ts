import { createSharedComposable } from '@vueuse/core'
import { ThemeMode } from '@/constants'
import { useTheme } from './useTheme'

export type EChartsPaletteKey =
  | 'primaryText'
  | 'secondaryText'
  | 'tertiaryText'
  | 'axisLine'
  | 'splitLine'
  | 'tooltipBg'
  | 'tooltipBorder'
  | 'tooltipText'

type EChartsThemeName = typeof ThemeMode.Light | typeof ThemeMode.Dark
type EChartsTooltipTrigger = 'axis' | 'item'

export interface BaseEChartsTooltipOption {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  confine: boolean
  extraCssText?: string
  textStyle: {
    color: string
  }
  trigger: EChartsTooltipTrigger
}

export interface BaseEChartsOption {
  backgroundColor: 'transparent'
  color: string[]
  darkMode: boolean
  textStyle: {
    color: string
    fontFamily: string
  }
  tooltip: BaseEChartsTooltipOption
}

const fallbackTheme: Record<
  EChartsThemeName,
  Record<EChartsPaletteKey, string>
> = {
  [ThemeMode.Light]: {
    primaryText: '#21252c',
    secondaryText: '#606773',
    tertiaryText: '#89909d',
    axisLine: 'rgba(148, 163, 184, 0.34)',
    splitLine: 'rgba(148, 163, 184, 0.18)',
    tooltipBg: 'rgba(255, 255, 255, 0.96)',
    tooltipBorder: 'rgba(148, 163, 184, 0.22)',
    tooltipText: '#21252c',
  },
  [ThemeMode.Dark]: {
    primaryText: '#fdfdfd',
    secondaryText: '#bbbdc3',
    tertiaryText: '#888c93',
    axisLine: 'rgba(148, 163, 184, 0.28)',
    splitLine: 'rgba(148, 163, 184, 0.16)',
    tooltipBg: 'rgba(21, 24, 31, 0.96)',
    tooltipBorder: 'rgba(148, 163, 184, 0.24)',
    tooltipText: '#f8fafc',
  },
}

const lightPalette = [
  '#1677ff',
  '#14c9c9',
  '#52c41a',
  '#faad14',
  '#f759ab',
  '#722ed1',
  '#fa541c',
  '#2f54eb',
] as const

const darkPalette = [
  '#69b1ff',
  '#5cdbd3',
  '#95de64',
  '#ffd666',
  '#ff85c0',
  '#b37feb',
  '#ff9c6e',
  '#85a5ff',
] as const

function getRgbChannels(value: string) {
  const channels = value
    .replace(/\//g, ' ')
    .split(/[\s,]+/)
    .filter(Boolean)

  const [red, green, blue] = channels
  if (!red || !green || !blue) return null

  return `${red}, ${green}, ${blue}`
}

function getCssVarValue(name: string) {
  if (typeof window === 'undefined') return ''

  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

export function getCssRgbVar(name: string, fallback: string) {
  const channels = getRgbChannels(getCssVarValue(name))

  return channels ? `rgb(${channels})` : fallback
}

export function getCssRgbVarAlpha(
  name: string,
  alpha: number,
  fallback: string
) {
  const channels = getRgbChannels(getCssVarValue(name))

  return channels ? `rgba(${channels}, ${alpha})` : fallback
}

export const useEChartsTheme = createSharedComposable(() => {
  const { themeMode, themeColor } = useTheme()
  const eChartsThemeName = computed<EChartsThemeName>(() =>
    themeMode.value === ThemeMode.Dark ? ThemeMode.Dark : ThemeMode.Light
  )

  const colorPalette = computed(() => {
    // themeColor 作为依赖触发重新计算，因为 getCssRgbVar 读取的 CSS 变量非响应式
    themeColor.value
    const primary = getCssRgbVar('--w-color-primary', lightPalette[0])
    const palette =
      eChartsThemeName.value === ThemeMode.Dark
        ? [...darkPalette]
        : [...lightPalette]

    return [primary, ...palette.filter((item) => item !== primary)]
  })

  const getEChartsColor = (key: EChartsPaletteKey) => {
    if (key === 'axisLine') {
      return getCssRgbVarAlpha(
        '--w-border-color-2',
        eChartsThemeName.value === ThemeMode.Dark ? 0.34 : 0.44,
        fallbackTheme[eChartsThemeName.value].axisLine
      )
    }

    if (key === 'splitLine') {
      return getCssRgbVarAlpha(
        '--w-border-color-2',
        eChartsThemeName.value === ThemeMode.Dark ? 0.18 : 0.3,
        fallbackTheme[eChartsThemeName.value].splitLine
      )
    }

    return fallbackTheme[eChartsThemeName.value][key]
  }

  const baseChartOption = computed<BaseEChartsOption>(() => ({
    backgroundColor: 'transparent',
    color: colorPalette.value,
    darkMode: eChartsThemeName.value === ThemeMode.Dark,
    textStyle: {
      color: getEChartsColor('secondaryText'),
      fontFamily:
        '"Inter Variable", "Inter Variable Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif',
    },
    tooltip: {
      backgroundColor: getEChartsColor('tooltipBg'),
      borderColor: getEChartsColor('tooltipBorder'),
      borderWidth: 1,
      confine: true,
      extraCssText:
        'box-shadow: 0 12px 30px rgb(15 23 42 / 0.14); border-radius: 8px;',
      textStyle: {
        color: getEChartsColor('tooltipText'),
      },
      trigger: 'axis',
    },
  }))

  return {
    baseChartOption,
    colorPalette,
    eChartsThemeName,
    getEChartsColor,
    themeColor,
  }
})
