import type {
  EventListeners,
  OverlayScrollbars,
  PartialOptions,
} from 'overlayscrollbars'
import type { Component } from 'vue'

export interface ScrollbarProps {
  /**
   * @desc 内容包裹元素 class，作用在滚动内容层上（等价旧实现的 content-class）
   * @default ''
   */
  contentClass?: string
  /**
   * @desc OverlayScrollbars 选项，传入 false / null 可关闭自定义滚动条
   * @default undefined
   */
  options?: PartialOptions | false | null
  /**
   * @desc OverlayScrollbars 事件监听
   * @default undefined
   */
  events?: EventListeners | false | null
  /**
   * @desc 延迟到浏览器空闲时初始化，用于降低首屏开销
   * @default false
   */
  defer?: boolean | IdleRequestOptions
  /**
   * @desc 根节点标签或组件
   * @default 'div'
   */
  element?: string | Component
}

export interface ScrollbarInstance {
  /**
   * @desc 获取滚动容器元素
   */
  getScrollElement: () => HTMLElement | null
  /**
   * @desc 获取内容元素
   */
  getContentElement: () => HTMLElement | null
  /**
   * @desc 获取根节点元素
   */
  getElement: () => HTMLElement | null
  /**
   * @desc 滚动到指定位置
   */
  scrollTo: (options: ScrollToOptions) => void
  /**
   * @desc 设置垂直滚动距离
   */
  setScrollTop: (value: number) => void
  /**
   * @desc 设置水平滚动距离
   */
  setScrollLeft: (value: number) => void
  /**
   * @desc 手动刷新滚动条尺寸
   */
  update: () => void
  /**
   * @desc 获取 OverlayScrollbars 实例，供高级用法使用
   */
  getInstance: () => OverlayScrollbars | null
}
