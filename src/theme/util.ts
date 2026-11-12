import { ConfigProvider, type ThemeConfig } from 'antdv-next'
import { THEME_MODE } from '@/constants'
import {
  COLOUR_WEAKNESS_CLASS,
  DEFAULT_PRIMARY_COLOR,
  FONT_FAMILY_VAR,
  FONT_WEIGHT_VAR,
  GREY_MODE_CLASS,
  LETTER_SPACING_VAR,
  PRIMARY_COLOR_VAR,
  THEME_TRANSITION_CLASS,
} from './constant'
import type { Font } from '#/config'

let unlockFrame: number | undefined

/**
 * 把明暗主题写进根节点
 *
 * @param mode 解析后的主题
 */
export function setThemeMode(
  mode: typeof THEME_MODE.Light | typeof THEME_MODE.Dark
) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
  root.classList.toggle(THEME_MODE.Dark, mode === THEME_MODE.Dark)
}

/**
 * 写入主题色 CSS 变量
 *
 * @param themeColor "R G B" 通道串,不是 rgb() 字符串
 */
export function setPrimaryColor(themeColor: string) {
  document.documentElement.style.setProperty(
    PRIMARY_COLOR_VAR,
    themeColor || DEFAULT_PRIMARY_COLOR
  )
}

/**
 * 写入字体相关的 data 属性与 CSS 变量
 *
 * font 由 store 的 afterHydrate 从 fontOptions 重建,stack 与 letterSpacing 恒定存在。
 *
 * @param font 当前字体配置
 */
export function setFont(font: Font) {
  const root = document.documentElement
  root.dataset.font = font.family

  root.style.setProperty(FONT_FAMILY_VAR, font.stack!)
  root.style.setProperty(FONT_WEIGHT_VAR, String(font.weight))
  root.style.setProperty(LETTER_SPACING_VAR, font.letterSpacing!)
}

/**
 * 切换色弱 / 灰色模式 class
 *
 * @param colourWeakness 是否开启色弱模式
 * @param greyMode 是否开启灰色模式
 */
export function setColorFilters(colourWeakness: boolean, greyMode: boolean) {
  const root = document.documentElement
  root.classList.toggle(COLOUR_WEAKNESS_CLASS, colourWeakness)
  root.classList.toggle(GREY_MODE_CLASS, greyMode)
}

/**
 * 同步 antd 全局主题配置
 *
 * 与 app.vue 的组件级 :theme 并存:组件树读 props,这里供脱离组件树的静态方法读取全局配置。
 *
 * @param theme 主题配置
 */
export function setAntdTheme(theme: ThemeConfig) {
  ConfigProvider.config({ theme })
}

/**
 * 在执行 task 期间临时禁用颜色过渡
 *
 * THEME_TRANSITION_CLASS 由本函数与 use-theme-transition 共享。揭示动画会提前加上该 class,
 * 并在动画结束时移除;若此处已加锁,说明正处于动画流程中,本函数只写状态、不负责解锁,
 * 否则会提前清除动画尚未用完的 class。
 *
 * @param task 写入主题状态的动作
 */
export function withoutColorTransition(task: () => void) {
  const root = document.documentElement
  const alreadyLocked = root.classList.contains(THEME_TRANSITION_CLASS)
  if (!alreadyLocked) {
    root.classList.toggle(THEME_TRANSITION_CLASS, true)
  }
  task()

  if (alreadyLocked) return
  if (unlockFrame !== undefined) cancelAnimationFrame(unlockFrame)
  unlockFrame = requestAnimationFrame(() => {
    unlockFrame = undefined
    root.classList.toggle(THEME_TRANSITION_CLASS, false)
  })
}

/**
 * 解析主题模式
 *
 * @param mode 模式
 * @param isDark 是否暗黑模式
 * @returns
 */
export function resolveThemeMode(mode: unknown, isDark: boolean) {
  return mode === THEME_MODE.Dark || (mode === THEME_MODE.Auto && isDark)
    ? THEME_MODE.Dark
    : THEME_MODE.Light
}
