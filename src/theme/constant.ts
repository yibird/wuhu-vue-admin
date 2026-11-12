/**
 * 主题切换期间禁用颜色过渡,避免 CSS transition 与 View Transition 揭示动画叠加。
 * 由 use-theme 的同步 watcher 与 use-theme-transition 共同使用。
 */
export const THEME_TRANSITION_CLASS = 'w-theme-transitioning'

/** 色弱模式根节点 class */
export const COLOUR_WEAKNESS_CLASS = 'w-color-weakness-mode'
/** 灰色模式根节点 class */
export const GREY_MODE_CLASS = 'w-grey-mode'

/** 主题色 CSS 变量,值为 "R G B" 通道串 */
export const PRIMARY_COLOR_VAR = '--w-color-primary'
export const DEFAULT_PRIMARY_COLOR = '22 119 255'

/** 字体相关 CSS 变量 */
export const FONT_FAMILY_VAR = '--w-font-family'
export const FONT_WEIGHT_VAR = '--w-font-weight'
export const LETTER_SPACING_VAR = '--w-letter-spacing'

/** View Transition 伪元素 */
export const VIEW_TRANSITION_PSEUDO_OLD = '::view-transition-old(root)'
export const VIEW_TRANSITION_PSEUDO_NEW = '::view-transition-new(root)'

/** 圆形揭示动画参数 */
export const DEFAULT_DURATION = 480
export const DEFAULT_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
