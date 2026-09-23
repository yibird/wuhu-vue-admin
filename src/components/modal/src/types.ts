import type {
  ModalProps as AntdvModalProps,
  ModalSlots as AntdvModalSlots,
} from 'antdv-next'

export interface ModalProps extends AntdvModalProps {
  /**
   * @desc 是否允许通过头部拖拽弹窗
   */
  draggable?: boolean
  /**
   * @desc 是否在头部显示全屏切换操作
   */
  fullscreenable?: boolean
  /**
   * @desc 受控的全屏状态，可通过 v-model:fullscreen 双向绑定
   */
  fullscreen?: boolean
  /**
   * @desc 进入全屏操作的辅助说明文案
   */
  fullscreenText?: string
  /**
   * @desc 退出全屏操作的辅助说明文案
   */
  exitFullscreenText?: string
}

/**
 * 弹窗位置
 */
export interface ModalPosition {
  /**
   * 水平坐标
   */
  x: number
  /**
   * 垂直坐标
   */
  y: number
}

export interface ModalEmits {
  /**
   * @desc 点击确定按钮时触发
   * @param event 鼠标事件
   */
  ok: [event: MouseEvent]
  /**
   * @desc 点击取消按钮或按下 Esc 键时触发
   * @param event 鼠标或键盘事件
   */
  cancel: [event: MouseEvent | KeyboardEvent]
  /**
   * @desc 打开状态变化时触发
   * @param open 是否打开
   */
  'update:open': [open: boolean]
  /**
   * @desc 全屏状态变化时触发
   * @param fullscreen 是否全屏
   */
  'update:fullscreen': [fullscreen: boolean]
  /**
   * @desc 全屏状态变化后触发
   * @param fullscreen 是否全屏
   */
  fullscreenChange: [fullscreen: boolean]
  /**
   * @desc 打开状态变化的动画结束后触发
   * @param open 是否打开
   */
  afterOpenChange: [open: boolean]
  /**
   * @desc 开始拖拽时触发
   * @param event 指针事件
   */
  dragStart: [event: PointerEvent]
  /**
   * @desc 结束拖拽时触发
   * @param position 拖拽结束后的位置
   */
  dragEnd: [position: ModalPosition]
}

/**
 * 模态框插槽，继承自 antdv-next 的 ModalSlots
 */
export type ModalSlots = AntdvModalSlots

export interface ModalInstance {
  /**
   * @desc 重置弹窗位置
   */
  resetPosition: () => void
  /**
   * @desc 设置全屏状态
   * @param fullscreen 是否全屏
   */
  setFullscreen: (fullscreen: boolean) => void
  /**
   * @desc 切换全屏状态
   */
  toggleFullscreen: () => void
}
