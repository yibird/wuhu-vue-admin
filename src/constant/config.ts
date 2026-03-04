/**
 * 主题模式
 */
export const ThemeMode = {
  // 黑夜
  Dark: 'dark',
  // 白天
  Light: 'light',
  // 自动
  Auto: 'auto',
}

/**
 * 语言
 */
export const Locale = {
  ZH_CN: 'zh_CN',
  EN: 'en',
} as const

/**
 * 菜单模式
 */
export const MenuMode = {
  // 垂直
  Vertical: 'vertical',
  // 水平
  Horizontal: 'horizontal',
  // 混合
  Mix: 'mix',
  // 双列
  Split: 'split',
} as const

/**
 * 侧边栏主题
 */
export const SiderTheme = {
  // 黑夜
  Dark: 'dark',
  // 白天
  Light: 'light',
} as const

/**
 * 头部操作栏
 */
export const HeaderWidget = {
  Search: 'search',
  DownloadCenter: 'downloadCenter',
  Theme: 'theme',
  Notice: 'notice',
  Translate: 'translate',
  FullScreen: 'fullScreen',
  LockScreen: 'lockPage',
  Setting: 'setting',
} as const

export const TabsTheme = {
  Card: 'card',
  Block: 'block',
  Google: 'google',
} as const

export type ThemeModeType = (typeof ThemeMode)[keyof typeof ThemeMode]
export type LocaleType = (typeof Locale)[keyof typeof Locale]
export type MenuModeType = (typeof MenuMode)[keyof typeof MenuMode]
export type SiderThemeType = (typeof SiderTheme)[keyof typeof SiderTheme]
export type HeaderWidgetType = (typeof HeaderWidget)[keyof typeof HeaderWidget]
export type TabsThemeType = (typeof TabsTheme)[keyof typeof TabsTheme]
