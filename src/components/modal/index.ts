import ModalComponent from './src/index.vue'
import { destroyAll, open } from './src/service'
export type {
  ModalAction,
  ModalComponent,
  ModalController,
  ModalInstance,
  ModalMaybePromise,
  ModalOpenOptions,
  ModalOpenPromise,
  ModalPosition,
  ModalProps,
  ModalResult,
  ModalUpdateOptions,
} from './src/types'

export { destroyAll, open }

export const Modal = Object.assign(ModalComponent, { destroyAll, open })
