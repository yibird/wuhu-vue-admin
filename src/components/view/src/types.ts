import type { HTMLAttributes } from 'vue'

/**
 * View 组件尺寸，数字按像素处理
 */
export type ViewSize = number | string
/**
 * 子元素排列方向
 */
export type ViewDirection = 'vertical' | 'horizontal'

export interface WViewProps extends /* @vue-ignore */ HTMLAttributes {
  /**
   * @desc 是否启用内边距，或直接指定内边距大小
   * @default true
   */
  padding?: boolean | string | number
  /**
   * @desc 是否占满整个容器
   * @default true
   */
  full?: boolean
  /**
   * @desc 子元素之间的间距。设置后 View 会作为 flex 容器使用。
   */
  gap?: ViewSize
  /**
   * @desc 设置 gap 布局的方向。
   * @default 'vertical'
   */
  direction?: ViewDirection
}

export interface ViewCollapsePayload {
  /**
   * @desc 收缩状态
   */
  collapsed: boolean
  /**
   * @desc 切换收缩状态
   */
  toggle: () => void
}

export interface ViewCollapsibleProps {
  /**
   * @desc 是否允许用户通过 trigger 控制内容折叠
   * @default false
   */
  collapsible?: boolean
  /**
   * @desc 是否显示内置或自定义 trigger
   * @default true
   */
  trigger?: boolean
  /**
   * @desc 内置 trigger 收起时的无障碍标签
   */
  collapseLabel?: string
  /**
   * @desc 内置 trigger 展开时的无障碍标签
   */
  expandLabel?: string
  /**
   * @desc 当前是否处于收起状态
   * @default false
   */
  collapsed?: boolean
}
export interface WViewSiderProps
  extends /* @vue-ignore */ HTMLAttributes, ViewCollapsibleProps {
  /**
   * @desc 展开状态下的宽度
   * @default 240
   */
  width?: ViewSize
  /**
   * @desc 收起状态下的宽度，设置为 0 时会完全收起内容
   * @default 0
   */
  collapsedWidth?: ViewSize
}

export interface WViewHeaderProps
  extends /* @vue-ignore */ HTMLAttributes, ViewCollapsibleProps {}

/**
 * ViewContent 属性类型，继承原生 HTML 属性
 */
export type WViewContentProps = HTMLAttributes

/**
 * ViewFooter 属性类型，继承原生 HTML 属性
 */
export type WViewFooterProps = HTMLAttributes

export interface WViewSiderSlots {
  /**
   * @desc 侧栏内容
   */
  default?: (props: { collapsed: boolean }) => VNode | VNode[]
  /**
   * @desc 自定义折叠触发器
   */
  trigger?: (props: ViewCollapsePayload) => VNode | VNode[]
}

export interface WViewHeaderSlots {
  /**
   * @desc 头部内容
   */
  default?: (props: { collapsed: boolean }) => VNode | VNode[]
  /**
   * @desc 自定义折叠触发器
   */
  trigger?: (props: ViewCollapsePayload) => VNode | VNode[]
}

export interface ViewCollapseEmits {
  /**
   * @desc 收起状态更新事件
   */
  'update:collapsed': [collapsed: boolean]
  /**
   * @desc 收起状态变化事件
   */
  collapse: [collapsed: boolean]
}
