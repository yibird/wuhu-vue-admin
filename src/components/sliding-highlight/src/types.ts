import type { VNodeChild } from 'vue'

/**
 * 高亮块相对容器左上角的几何信息
 */
export interface SlidingHighlightRect {
  x: number
  y: number
  width: number
  height: number
}

export interface SlidingHighlightProps {
  /**
   * @desc 子项使用的语义化容器标签，传入 `ul` 时高亮块会渲染为 `li`，保证列表语义合法
   * @default 'div'
   */
  as?: 'div' | 'ul'
  /**
   * @desc 高亮块相对每个子项的横向外扩距离（px），正值向外扩张
   * @default 20
   */
  inset?: number
  /**
   * @desc 高亮块的类名，用于自定义背景、圆角、阴影等视觉样式，也可以覆盖 CSS 变量 `--w-sliding-highlight-bg` / `--w-sliding-highlight-radius`
   */
  pillClassName?: string
  /**
   * @desc 定位层（承载高亮块运动的容器）的类名，用于覆盖定位方式
   */
  pillContainerClassName?: string
}

export interface SlidingHighlightSlots {
  /**
   * @desc 列表内容，悬浮其中的直接子元素时高亮块会跟随移动
   */
  default?: () => VNodeChild
}

export interface SlidingHighlightInstance {
  /**
   * @desc 高亮指定子项，用于键盘导航等非指针场景
   */
  highlight: (element: HTMLElement) => void
  /**
   * @desc 清除高亮
   */
  clear: () => void
}
