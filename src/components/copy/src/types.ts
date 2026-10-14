import type { VNodeChild } from 'vue'

export interface CopySlots {
  /**
   * @desc 复制内容前展示的前缀
   */
  prefix?: () => VNodeChild
  /**
   * @desc 要复制的内容,点击组件时复制该插槽渲染出的文本
   */
  default?: () => VNodeChild
  /**
   * @desc 复制内容后展示的后缀,不传时默认为复制图标
   */
  suffix?: () => VNodeChild
}
