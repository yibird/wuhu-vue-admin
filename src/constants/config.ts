/**
 * 主题模式
 */
export const THEME_MODE = {
  // 黑夜
  Dark: 'dark',
  // 白天
  Light: 'light',
  // 自动
  Auto: 'auto',
} as const

/**
 * 语言
 */
export const LOCALE = {
  ZH_CN: 'zh_CN',
  EN: 'en',
} as const

/**
 * 字体
 */
export const FONT_FAMILY = {
  // 跟随系统
  System: 'system',
  // Outfit
  Outfit: 'outfit',
  // Inter
  Inter: 'inter',
  // DM Sans
  DmSans: 'dm-sans',
  // Space Grotesk
  SpaceGrotesk: 'space-grotesk',
  // Roboto Mono
  RobotoMono: 'roboto-mono',
  // 微软雅黑
  MicrosoftYaHei: 'microsoft-yahei',
} as const

/**
 * 菜单模式
 */
export const MENU_MODE = {
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
export const SIDER_THEME = {
  // 黑夜
  Dark: 'dark',
  // 白天
  Light: 'light',
} as const

/**
 * 头部操作栏
 */
export const HEADER_WIDGET = {
  Search: 'search',
  TaskCenter: 'taskCenter',
  DownloadCenter: 'downloadCenter',
  NoteBook: 'noteBook',
  Theme: 'theme',
  Notice: 'notice',
  Translate: 'translate',
  FullScreen: 'fullScreen',
  LockScreen: 'lockPage',
  Setting: 'setting',
  AI: 'ai',
} as const

export const TAB_THEME = {
  Card: 'card',
  Block: 'block',
  Google: 'google',
} as const

/**
 *  loading动画
 */
export const LOADING_ADNIMATION = {
  Beat: 'beat',
  Spinner: 'spinner',
  Pulse: 'pulse',
  Bars: 'bars',
  Ring: 'ring',
} as const

/**
 * 页面动画
 */
export const PAGE_ANIMATION = {
  // 从左滑动
  SlideLeft: 'slide-left',
  // 从右滑动
  SlideRight: 'slide-right',
  // 从上滑动
  SlideUp: 'slide-up',
  // 从下滑动
  SlideDown: 'slide-down',
  // 淡入淡出
  Fade: 'fade',
  // 放大
  FadeScale: 'fade-scale',
  // 横向反转
  FlipX: 'flip-x',
  // 竖向反转
  FlipY: 'flip-y',
} as const

/**
 * 页面动画mode
 */
export const PAGE_ANIMATION_MODE = {
  DEFAULT: 'default',
  OUT_INT: 'out-in',
  IN_OUT: 'in-out',
} as const

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE]
export type Locale = (typeof LOCALE)[keyof typeof LOCALE]
export type FontFamily = (typeof FONT_FAMILY)[keyof typeof FONT_FAMILY]
export type MenuMode = (typeof MENU_MODE)[keyof typeof MENU_MODE]
export type HeaderWidget = (typeof HEADER_WIDGET)[keyof typeof HEADER_WIDGET]
export type TabTheme = (typeof TAB_THEME)[keyof typeof TAB_THEME]
export type SiderTheme = (typeof SIDER_THEME)[keyof typeof SIDER_THEME]
export type LoadingAnimation =
  (typeof LOADING_ADNIMATION)[keyof typeof LOADING_ADNIMATION]
export type PageAnimation = (typeof PAGE_ANIMATION)[keyof typeof PAGE_ANIMATION]
export type PageAnimationMode =
  (typeof PAGE_ANIMATION_MODE)[keyof typeof PAGE_ANIMATION_MODE]
