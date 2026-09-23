import type { HTMLAttributes, VNodeChild } from 'vue'

/**
 * 容器渲染的根元素标签
 */
export type ContainerTag = keyof HTMLElementTagNameMap

/**
 * 容器尺寸
 */
export interface ContainerSize {
  /**
   * 宽度
   */
  readonly width: number
  /**
   * 高度
   */
  readonly height: number
}

export interface LazyContainerProps extends /* @vue-ignore */ HTMLAttributes {
  /**
   * @desc 容器渲染的根元素标签
   * @default 'div'
   */
  tag?: ContainerTag
  /**
   * @desc 是否跳过视口监听并立即渲染
   * @default false
   */
  eager?: boolean
  /**
   * @desc 首次进入视口后是否保持内容挂载
   * @default true
   */
  once?: boolean
  /**
   * @desc IntersectionObserver 的 rootMargin
   * @default '200px 0px'
   */
  rootMargin?: string
  /**
   * @desc 触发渲染所需的交叉比例
   * @default 0
   */
  threshold?: number | number[]
  /**
   * @desc 内容挂载前预留的最小高度
   * @default 1
   */
  minHeight?: number | string
}

export interface LazyContainerSlotProps {
  /**
   * @desc 容器当前是否与观察视口相交
   */
  visible: boolean
  /**
   * @desc 默认内容是否已至少挂载一次
   */
  loaded: boolean
}

export interface LazyContainerSlots {
  /**
   * @desc 容器内容
   */
  default?: (props: LazyContainerSlotProps) => VNodeChild
  /**
   * @desc 内容挂载前显示的占位内容
   */
  placeholder?: (props: LazyContainerSlotProps) => VNodeChild
}

export interface LazyContainerEmits {
  /**
   * @desc 可见状态变化事件
   */
  'visible-change': [visible: boolean]
  /**
   * @desc 内容首次挂载事件
   */
  load: []
}

export interface ResizeContainerProps extends /* @vue-ignore */ HTMLAttributes {
  /**
   * @desc 容器渲染的根元素标签
   * @default 'div'
   */
  tag?: ContainerTag
  /**
   * @desc 首次测量前暴露的宽度
   * @default 0
   */
  initialWidth?: number
  /**
   * @desc 首次测量前暴露的高度
   * @default 0
   */
  initialHeight?: number
  /**
   * @desc ResizeObserver 使用的盒模型
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

export interface ResizeContainerSlots {
  /**
   * @desc 容器内容，参数为当前容器尺寸
   */
  default?: (size: ContainerSize) => VNodeChild
}

export interface ResizeContainerEmits {
  /**
   * @desc 容器尺寸变化事件
   */
  resize: [size: ContainerSize]
}
