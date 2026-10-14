export interface ScrollbarProps {
  /**
   * @desc 内容元素 class
   * @default ''
   */
  contentClass?: string
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
   * @desc 滚动到指定位置
   */
  scrollTo: (options: ScrollToOptions) => void
}
