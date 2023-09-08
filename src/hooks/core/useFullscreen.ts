import { ref, Ref, unref } from 'vue';
import { isBrowser } from '/@/utils/is';
import { useSupported } from './useSupported';
import { useEventListener } from './useEventListener';
export type MaybeElement = HTMLElement | SVGElement | undefined | null;
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>;
interface ConfigurableDocument {
  document?: Document;
}

interface UseFullscreenOptions extends ConfigurableDocument {
  /**
   * 卸载组件时自动全屏退出
   * @default false
   */
  autoExit?: boolean;
}
const defaultDocument = isBrowser() ? window.document : undefined;

type FunctionMap = [
  'requestFullscreen',
  'exitFullscreen',
  'fullscreenElement',
  'fullscreenEnabled',
  'fullscreenchange',
  'fullscreenerror',
];

// from: https://github.com/sindresorhus/screenfull.js/blob/master/src/screenfull.js
const functionsMap: FunctionMap[] = [
  [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
  ],
  // New WebKit
  [
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  // Old WebKit
  [
    'webkitRequestFullScreen',
    'webkitCancelFullScreen',
    'webkitCurrentFullScreenElement',
    'webkitCancelFullScreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
  ],
  [
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozFullScreenElement',
    'mozFullScreenEnabled',
    'mozfullscreenchange',
    'mozfullscreenerror',
  ],
  [
    'msRequestFullscreen',
    'msExitFullscreen',
    'msFullscreenElement',
    'msFullscreenEnabled',
    'MSFullscreenChange',
    'MSFullscreenError',
  ],
] as any;

export function useFullscreen(target?: MaybeElementRef, options: UseFullscreenOptions = {}) {
  const { document = defaultDocument, autoExit = false } = options;
  const targetRef = target || document?.querySelector('html');
  const isFullscreen = ref(false);
  let map: FunctionMap = functionsMap[0];

  /**
   * 判断当前环境是否支持全屏操作
   */
  const isSupported = useSupported(() => {
    if (!document) return false;
    for (const m of functionsMap) {
      if (m[1] in document) {
        map = m;
        return true;
      }
    }
    return false;
  });
  const [REQUEST, EXIT, ELEMENT, , EVENT] = map;

  async function enter() {
    if (!isSupported.value) return;
    await exit();

    const target = unref(targetRef);
    if (!target) return;
    await target[REQUEST]();
    isFullscreen.value = true;
  }
  async function exit() {
    if (!unref(isSupported)) return;
    if (document?.[ELEMENT]) {
      await document[EXIT]();
    }
    isFullscreen.value = true;
  }
  async function toggle() {
    isFullscreen.value ? await exit() : await enter();
  }

  //   // 监听退出全屏
  //   if (document) {
  //     useEventListener(
  //       document,
  //       EVENT,
  //       () => {
  //         isFullscreen.value = !!document?.[ELEMENT];
  //       },
  //       false,
  //     );
  //   }
  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
  };
}
