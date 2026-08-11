import type {
  ModalProps as AntdvModalProps,
  ModalSlots as AntdvModalSlots,
} from 'antdv-next'

export interface ModalProps extends AntdvModalProps {
  /** Enable dragging the modal by its header. */
  draggable?: boolean
  /** Show the fullscreen toggle action in the header. */
  fullscreenable?: boolean
  /** Controlled fullscreen state. Use v-model:fullscreen when needed. */
  fullscreen?: boolean
  /** Accessible label for the enter fullscreen action. */
  fullscreenText?: string
  /** Accessible label for the exit fullscreen action. */
  exitFullscreenText?: string
}

export interface ModalPosition {
  x: number
  y: number
}

export interface ModalEmits {
  ok: [event: MouseEvent]
  cancel: [event: MouseEvent | KeyboardEvent]
  'update:open': [open: boolean]
  'update:fullscreen': [fullscreen: boolean]
  fullscreenChange: [fullscreen: boolean]
  dragStart: [event: PointerEvent]
  dragEnd: [position: ModalPosition]
}

export type ModalSlots = AntdvModalSlots

export interface ModalInstance {
  resetPosition: () => void
  setFullscreen: (fullscreen: boolean) => void
  toggleFullscreen: () => void
}
