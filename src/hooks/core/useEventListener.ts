// export function useEventListener<E extends keyof WindowEventMap>(
//   target: Window,
//   event: E,
//   listener: (this: Window, ev: WindowEventMap[E]) => any,
//   options?: boolean | AddEventListenerOptions,
// ): () => void;

import { watch } from 'vue';

type Target = Window | Document | HTMLElement;
export function useEventListener<K extends keyof WindowEventMap>(
  target: Target,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  if (!target) {
    console.log('target 不能为空');
    return;
  }
  let cleanup: () => void;
  const stopWatch = watch(
    () => target,
    (el) => {
      if (!el) return;
      el.addEventListener('click', listener, options);

      cleanup = () => {
        el.removeEventListener('click', listener, options);
      };
    },
    { immediate: true, flush: 'post' },
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  return stop;
}
