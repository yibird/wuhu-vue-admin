import type { HTMLAttributes } from 'vue'

export type ViewSize = number | string
export type ViewDirection = 'vertical' | 'horizontal'

export interface WViewProps extends /* @vue-ignore */ HTMLAttributes {
  /**
   * @desc 是否启用内边距，或直接指定内边距大小
   * @default true
   */
  padding?: boolean | string | number
  /**
   * @desc 是否占满整个容器
   * @default false
   */
  full?: boolean
  /**
   * @desc 子元素之间的间距。设置后 View 会作为 flex 容器使用。
   * @default
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
   * 切换状态方法
   *
   * @returns
   */
  toggle: () => void
}

export interface ViewCollapsibleProps {
  /**
   * @desc 是否允许用户通过 trigger 控制内容折叠。
   * @default
   */
  collapsible?: boolean
  /**
   * @desc 是否显示内置或自定义 trigger。
   * @default
   */
  trigger?: boolean
  /**
   * @desc 内置 trigger 收起时的无障碍标签。
   * @default
   */
  collapseLabel?: string
  /**
   * @desc 内置 trigger 展开时的无障碍标签。
   * @default
   */
  expandLabel?: string
  /**
   * @desc 当前是否处于收起状态。
   * @default
   */
  collapsed?: boolean
}
export interface WViewSiderProps
  extends /* @vue-ignore */ HTMLAttributes, ViewCollapsibleProps {
  /**
   * @desc 展开状态下的宽度。
   * @default
   */
  width?: ViewSize
  /**
   * @desc 收起状态下的宽度。设置为 0 时会完全收起内容。
   * @default
   */
  collapsedWidth?: ViewSize
}

export interface WViewHeaderProps
  extends /* @vue-ignore */ HTMLAttributes, ViewCollapsibleProps {}

export type WViewContentProps = HTMLAttributes

export type WViewFooterProps = HTMLAttributes

export interface WViewSiderSlots {
  default?: (props: { collapsed: boolean }) => VNode | VNode[]
  trigger?: (props: ViewCollapsePayload) => VNode | VNode[]
}

export interface WViewHeaderSlots {
  default?: (props: { collapsed: boolean }) => VNode | VNode[]
  trigger?: (props: ViewCollapsePayload) => VNode | VNode[]
}

export interface ViewCollapseEmits {
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}
