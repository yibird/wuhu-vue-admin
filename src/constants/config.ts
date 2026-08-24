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
} as const

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

export const TabsTheme = {
  Card: 'card',
  Block: 'block',
  Google: 'google',
} as const

/**
 *  loading动画
 */
export const LoadingAnimation = {
  Beat: 'beat',
  Spinner: 'spinner',
  Pulse: 'pulse',
  Bars: 'bars',
  Ring: 'ring',
} as const

/**
 * 页面动画
 */
export const PageAnimation = {
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
export const PageAnimationMode = {
  DEFAULT: 'default',
  OUT_INT: 'out-in',
  IN_OUT: 'in-out',
} as const
