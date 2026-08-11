import type { HTMLAttributes } from 'vue'

export type ViewSize = number | string

export type ViewDirection = 'vertical' | 'horizontal'

export interface ViewProps extends /* @vue-ignore */ HTMLAttributes {
  /**
   * @description 是否启用内边距，或直接指定内边距大小
   * @default true
   */
  padding?: boolean | string | number
  /**
   * @description 是否占满整个容器
   * @default false
   */
  full?: boolean
  /**
   * @description 子元素之间的间距。设置后 View 会作为 flex 容器使用。
   */
  gap?: ViewSize
  /**
   * @description 设置 gap 布局的方向。
   * @default vertical
   */
  direction?: ViewDirection
}

export interface ViewCollapseSlotProps {
  collapsed: boolean
  toggle: () => void
}

export interface ViewCollapsibleProps {
  /** 是否允许用户通过 trigger 控制内容折叠。 */
  collapsible?: boolean
  /** 是否显示内置或自定义 trigger。 */
  trigger?: boolean
  /** 内置 trigger 收起时的无障碍标签。 */
  collapseLabel?: string
  /** 内置 trigger 展开时的无障碍标签。 */
  expandLabel?: string
  /** 当前是否处于收起状态。 */
  collapsed?: boolean
}

export interface ViewSiderProps
  extends /* @vue-ignore */ HTMLAttributes, ViewCollapsibleProps {
  /** 展开状态下的宽度。 */
  width?: ViewSize
  /** 收起状态下的宽度。设置为 0 时会完全收起内容。 */
  collapsedWidth?: ViewSize
}

export interface ViewHeaderProps
  extends /* @vue-ignore */ HTMLAttributes, ViewCollapsibleProps {}

export type ViewContentProps = HTMLAttributes

export type ViewFooterProps = HTMLAttributes

export interface ViewSiderSlots {
  default?: (props: { collapsed: boolean }) => unknown
  trigger?: (props: ViewCollapseSlotProps) => unknown
}

export interface ViewHeaderSlots {
  default?: (props: { collapsed: boolean }) => unknown
  trigger?: (props: ViewCollapseSlotProps) => unknown
}

export interface ViewContentSlots {
  default?: () => unknown
}

export interface ViewFooterSlots {
  default?: () => unknown
}

export interface ViewCollapseEmits {
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}
