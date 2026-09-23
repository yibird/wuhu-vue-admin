import type { Component, VNode, VNodeArrayChildren } from 'vue'
import type { SortableTransition } from '@dnd-kit/dom/sortable'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/vue'

/**
 * 拖拽项的唯一标识
 */
export type DraggableIdentifier = string | number

/**
 * 拖拽禁用配置，布尔值表示同时禁用拖拽与放置
 */
export type DraggableDisabled =
  | boolean
  | {
      /**
       * 是否禁用拖拽
       */
      draggable?: boolean
      /**
       * 是否禁用放置
       */
      droppable?: boolean
    }

/**
 * 列表项唯一标识的字段名或解析函数
 */
export type DraggableItemKey<T> =
  | (keyof T & string)
  | ((element: T, index: number) => DraggableIdentifier)

/**
 * 附加到列表项的数据或数据解析函数
 */
export type DraggableItemData<T> =
  | Record<string, unknown>
  | ((element: T, index: number) => Record<string, unknown>)

export interface DraggableProps<T = unknown> {
  /**
   * @desc 列表容器渲染的标签或组件
   * @default 'div'
   */
  tag?: string | Component
  /**
   * @desc 列表项插槽返回多个根节点时使用的降级标签
   * @default 'div'
   */
  itemTag?: string | Component
  /**
   * @desc 列表项唯一标识的字段名或解析函数
   */
  itemKey: DraggableItemKey<T>
  /**
   * @desc 是否禁用当前列表所有项的拖拽与放置
   */
  disabled?: DraggableDisabled
  /**
   * @desc 排序过渡时长，单位毫秒
   * @default 150
   */
  animation?: number
  /**
   * @desc 拖拽源处于激活状态时附加的类名
   */
  ghostClass?: string
  /**
   * @desc 限定拖拽触发区域为匹配该选择器的后代元素
   */
  handleSelector?: string
  /**
   * @desc 列表项的拖拽类型
   */
  type?: string
  /**
   * @desc 附加到每个可排序列表项的数据
   */
  data?: DraggableItemData<T>
  /**
   * @desc dnd-kit 高级过渡配置，设置后会覆盖 animation
   */
  transition?: SortableTransition | null
}

/**
 * 列表项的拖拽状态
 */
export interface DraggableItemState {
  /**
   * 是否为当前拖拽源
   */
  isDragSource: boolean
  /**
   * 是否正在拖拽
   */
  isDragging: boolean
  /**
   * 是否为当前放置目标
   */
  isDropTarget: boolean
  /**
   * 是否正在放置
   */
  isDropping: boolean
}

/**
 * 列表项插槽参数
 */
export interface DraggableItemSlotProps<T> extends DraggableItemState {
  /**
   * 当前列表项元素
   */
  element: T
  /**
   * 当前列表项索引
   */
  index: number
}

export interface DraggableSlots<T = unknown> {
  /**
   * @desc 列表项内容插槽，参数包含列表项元素、索引与拖拽状态
   */
  item: (props: DraggableItemSlotProps<T>) => VNodeArrayChildren
  /**
   * @desc 列表头部插槽
   */
  header?: () => VNodeArrayChildren
  /**
   * @desc 列表底部插槽
   */
  footer?: () => VNodeArrayChildren
}

export interface DraggableEmits<T = unknown> {
  /**
   * @desc 拖拽开始时触发
   */
  start: [event: DragStartEvent]
  /**
   * @desc 拖拽结束且顺序发生变化时触发，携带排序后的列表
   */
  update: [event: DragEndEvent, items: T[]]
  /**
   * @desc 拖拽结束时触发
   */
  end: [event: DragEndEvent]
}

export interface DraggableItemProps {
  /**
   * @desc 列表项渲染的 vnode
   */
  vnode?: VNode
  /**
   * @desc 列表项唯一标识
   */
  id: DraggableIdentifier
  /**
   * @desc 列表项在列表中的索引
   */
  index: number
  /**
   * @desc 是否禁用该列表项的拖拽与放置
   * @default false
   */
  disabled?: DraggableDisabled
  /**
   * @desc 拖拽源处于激活状态时附加的类名
   */
  ghostClass?: string
  /**
   * @desc 限定拖拽触发区域为匹配该选择器的后代元素
   */
  handleSelector?: string
  /**
   * @desc 可排序分组标识，同组之间可以互相拖拽
   */
  group?: DraggableIdentifier
  /**
   * @desc 允许接收的拖拽类型
   */
  accept?: string | string[]
  /**
   * @desc 碰撞检测优先级
   */
  collisionPriority?: number
  /**
   * @desc 列表项的拖拽类型
   */
  type?: string
  /**
   * @desc 附加到该列表项的数据
   */
  data?: Record<string, unknown>
  /**
   * @desc dnd-kit 高级过渡配置
   */
  transition?: SortableTransition | null
  /**
   * @desc 独立可排序项使用的包裹元素
   * @default 'div'
   */
  tag?: string | Component
  /**
   * @desc 插槽仅有一个根节点时克隆该节点，不再渲染包裹元素
   * @default false
   */
  unwrap?: boolean
}
