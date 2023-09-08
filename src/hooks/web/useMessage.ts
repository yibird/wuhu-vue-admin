import { message as Message, Modal } from 'ant-design-vue';
import { VueNode } from 'ant-design-vue/es/_util/type';
import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { VNode } from 'vue';
import { isString } from '/@/utils/is';

type Content = Pick<ModalFuncProps, 'content'>;

function renderContent({ content }: Content): (() => VueNode) | VueNode {
  // const container = document.createElement('div');
  // container.innerHTML = `<div>${content}</div>`;
  return content;
}

export function createModalConfig(config: Partial<ModalFuncProps>) {
  return {
    ...config,
    content: '',
    // renderContent(config)
  };
}

export function createSuccessModal(config: ModalFuncProps) {
  return Modal.success(createModalConfig(config));
}
export function createWarningModal(config: ModalFuncProps) {
  return Modal.warning(createModalConfig(config));
}
export function createErrorModal(config: ModalFuncProps) {
  return Modal.info(createModalConfig(config));
}
export function createInfoModal(config: ModalFuncProps) {
  return Modal.info(createModalConfig(config));
}
export function createConfirmModal(config: ModalFuncProps) {
  return Modal.confirm(createModalConfig(config));
}

export function useMessage() {
  return {
    createMessage: Message,
    createSuccessModal,
    createWarningModal,
    createErrorModal,
    createInfoModal,
    createConfirmModal,
  };
}
