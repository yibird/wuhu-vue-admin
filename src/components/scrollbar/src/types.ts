import type { OverlayScrollbars } from 'overlayscrollbars'
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue'

export interface ScrollbarProps extends OverlayScrollbarsComponentProps {
  /**
   * @description 内容元素class
   * @default ''
   */
  contentClass?: string
}

export interface ScrollbarEmits {
  scroll: [event: Event]
}

export interface ScrollbarInstance {
  osInstance: () => OverlayScrollbars | null
  getElement: () => HTMLElement | null
  getContentElement: () => HTMLElement | null
  getScrollElement: () => HTMLElement | null
  scrollTo: (options: ScrollToOptions) => void | undefined
}
