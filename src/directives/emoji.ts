import { Directive } from 'vue';

const regRule =
  /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g;

/**
 * 查找指定type的元素,如果传入DOM元素的类型和type相同则直接返回该元素,否则通过querySelector()
 * 查找传入DOM元素的所匹配的子元素。
 * @param parent 传入元素
 * @param type 元素的类型
 */
const findElement = (parent: HTMLElement, type: string): HTMLElement | null => {
  return parent.tagName.toLowerCase() === type
    ? parent
    : parent.querySelector(type);
};

/**
 * 触发在指定DOM元素上指定type事件
 * @param el 需要触发事件的DOM元素
 * @param type 触发的事件类型
 */
const trigger = (el: HTMLElement, type: string) => {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};

export const emoji: Directive = {
  beforeMount(el) {
    // 查找input元素
    const inputEl = findElement(el, 'input') as HTMLInputElement;
    if (!inputEl) return;
    el.$inputEl = inputEl;
    (inputEl as any).handler = () => {
      // 获取input输入值
      const value = inputEl.value;
      inputEl.value = value.replaceAll(regRule, '');
      // 替换emoji表情后触发input事件
      trigger(inputEl, 'input');
    };
    inputEl.addEventListener('keyup', (inputEl as any).handler);
  },
  unmounted(el) {
    el.$inputEl.removeEventListener('keyup', el.$inputEl.handler);
  },
};
