import type {
  ModalProps as AntdvModalProps,
  ModalSlots as AntdvModalSlots,
} from 'antdv-next'
import type { AppContext, Component, VNodeChild } from 'vue'

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

/** A lazy component loader, normally `() => import('./Feature.vue')`. */
export type ModalAsyncComponentLoader = () => Promise<
  Component | { default: Component }
>

export type ModalComponent = Component | ModalAsyncComponentLoader

export type ModalMaybePromise<T> = T | PromiseLike<T>

export type ModalAction = 'ok' | 'cancel' | 'destroy'

export interface ModalResult<TResult = unknown> {
  action: ModalAction
  data?: TResult
}

export interface ModalOpenOptions<
  TComponentProps extends object = Record<string, unknown>,
  TResult = unknown,
> extends Omit<ModalProps, 'open' | 'onOk' | 'onCancel' | 'afterClose'> {
  /** The component rendered inside the modal. Function values are lazy loaders. */
  component?: ModalComponent
  /** Props passed to `component`. */
  componentProps?: TComponentProps
  /** Static content used when `component` is not provided. */
  content?: VNodeChild
  /** Called before resolving the promise after the OK action. Return false to keep it open. */
  onOk?: (event: MouseEvent) => ModalMaybePromise<TResult | false | void>
  /** Called before resolving the promise after the cancel action. Return false to keep it open. */
  onCancel?: (
    event: MouseEvent | KeyboardEvent
  ) => ModalMaybePromise<TResult | false | void>
  /** Called after the close transition and before the host is unmounted. */
  afterClose?: () => void
  /** Optional application context for use outside the main application. */
  appContext?: AppContext
}

export type ModalUpdateOptions<
  TComponentProps extends object = Record<string, unknown>,
  TResult = unknown,
> = Partial<ModalOpenOptions<TComponentProps, TResult>>

export interface ModalController<
  TComponentProps extends object = Record<string, unknown>,
  TResult = unknown,
> {
  /** Close with the normal Modal transition and resolve as a destroy action. */
  close: () => void
  /** Immediately unmount the host and resolve as a destroy action. */
  destroy: () => void
  /** Update options while the modal is mounted. */
  update: (
    options:
      | ModalUpdateOptions<TComponentProps, TResult>
      | ((
          previous: ModalOpenOptions<TComponentProps, TResult>
        ) => ModalUpdateOptions<TComponentProps, TResult>)
  ) => void
}

export type ModalOpenPromise<
  TComponentProps extends object = Record<string, unknown>,
  TResult = unknown,
> = Promise<ModalResult<TResult>> & ModalController<TComponentProps, TResult>

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
