import type { App, Directive, DirectiveBinding } from 'vue';
import { throttle } from 'lodash-es';

function getHandlers(el: HTMLElement, binding: DirectiveBinding) {
  const handler = throttle((evt: MouseEvent) => {
    if (typeof binding.value !== 'function') return;
    const outside = !(
      el === evt.target || el.contains(evt.target as HTMLElement)
    );
    binding.value(outside);
  }, 10);
  return { handler };
}

export const clickOutside: Directive = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const { handler } = getHandlers(el, binding);
    (el as any).clickOutsideEvent = handler;
    document.addEventListener('click', handler);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any).clickOutsideEvent);
  },
};

export function setupClickOutsideDirective(app: App) {
  app.directive('clickOutside', clickOutside);
}
