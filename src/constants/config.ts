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
  // 得意黑
  SmileySans: 'smiley-sans',
  // 霞鹜漫黑
  LxgwMarkerGothic: 'lxgw-marker-gothic',
  // 霞鹜文楷
  LxgwWenKai: 'lxgw-wen-kai',
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
  // 滑动
  SlideLeft: 'slide-left',
  SlideRight: 'slide-right',
  SlideUp: 'slide-up',
  SlideDown: 'slide-down',

  // 淡入淡出
  Fade: 'fade',
  // 淡入缩放
  FadeScale: 'fade-scale',
  // 渐显放大
  FadeZoom: 'fade-zoom',
  // 默认渐显滑动（从下进入）
  FadeSlide: 'fade-slide',
  // 从下方渐显滑入
  FadeSlideUp: 'fade-slide-up',
  // 从上方渐显滑入
  FadeSlideDown: 'fade-slide-down',
  // 从右侧渐显滑入
  FadeSlideLeft: 'fade-slide-left',
  // 从左侧渐显滑入
  FadeSlideRight: 'fade-slide-right',
  // 弹性渐显
  FadePop: 'fade-pop',
  // 旋转渐显
  FadeSpin: 'fade-spin',

  // 翻转
  FlipX: 'flip-x',
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

export type ThemeMode = ValueOf<typeof THEME_MODE>
export type Locale = ValueOf<typeof LOCALE>
export type FontFamily = ValueOf<typeof FONT_FAMILY>
export type MenuMode = ValueOf<typeof MENU_MODE>
export type HeaderWidget = ValueOf<typeof HEADER_WIDGET>
export type TabTheme = ValueOf<typeof TAB_THEME>
export type SiderTheme = ValueOf<typeof SIDER_THEME>
export type LoadingAnimation = ValueOf<typeof LOADING_ADNIMATION>
export type PageAnimation = ValueOf<typeof PAGE_ANIMATION>
export type PageAnimationMode = ValueOf<typeof PAGE_ANIMATION_MODE>
