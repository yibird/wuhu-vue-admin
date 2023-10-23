import { App, Directive, DirectiveBinding } from 'vue';

export const longPress: Directive = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw new Error('The directive value is not a function');
    }
    const handler = (e: MouseEvent) => binding.value(e);
    let pressTimer: NodeJS.Timeout | null = null;
    const start = (e: Event) => {
      // 如果触发的事件是点击事件,并且是鼠标按键是否是左键则直接返回
      if (e.type === 'click' && (e as MouseEvent).button !== 0) return;
      if (pressTimer === null) {
        pressTimer = setTimeout(() => handler(e as MouseEvent), 2000);
      }
    };
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };
    (el as any).clickEvent = cancel;
    // 添加事件监听器
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);
    // 取消计时器
    el.addEventListener('click', cancel);
    el.addEventListener('mouseout', cancel);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('click', (el as any).clickEvent);
  },
};

export function setupLongPressDirective(app: App) {
  app.directive('longPress', longPress);
}
