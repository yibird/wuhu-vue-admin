import ModalComponent from './src/index.vue'
export type { ModalInstance, ModalPosition, ModalProps } from './src/types'

/**
 * 模态框组件
 *
 * 注意:Modal 仅作为组件使用,不再提供 `Modal.open()` 等命令式 API,
 * 外部项目升级后如仍需命令式调用,请改用 antdv-next 提供的 Modal 服务。
 */
export const Modal = ModalComponent
