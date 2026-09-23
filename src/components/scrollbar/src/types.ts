import type { OverlayScrollbars } from 'overlayscrollbars'
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue'

export interface ScrollbarProps extends OverlayScrollbarsComponentProps {
  /**
   * @desc 内容元素 class
   * @default ''
   */
  contentClass?: string
}

export interface ScrollbarEmits {
  /**
   * @desc 滚动事件
   */
  scroll: [event: Event]
}

export interface ScrollbarInstance {
  /**
   * @desc 获取 OverlayScrollbars 实例
   */
  osInstance: () => OverlayScrollbars | null
  /**
   * @desc 获取滚动容器根元素
   */
  getElement: () => HTMLElement | null
  /**
   * @desc 获取内容元素
   */
  getContentElement: () => HTMLElement | null
  /**
   * @desc 获取滚动偏移元素
   */
  getScrollElement: () => HTMLElement | null
  /**
   * @desc 滚动到指定位置
   */
  scrollTo: (options: ScrollToOptions) => void | undefined
}
