import { throttle } from 'es-toolkit'

import type { Directive, DirectiveBinding } from 'vue'

type DebounceValue = (...args: any[]) => any

interface DebounceElement extends HTMLElement {
  _debouncedFunc?: ReturnType<typeof throttle>
}

export const debounce: Directive<DebounceElement, DebounceValue> = {
  mounted(el, binding: DirectiveBinding<DebounceValue>) {
    const { value, arg } = binding
    if (typeof value !== 'function') {
      console.warn(
        `[v-debounce]: expected to bind a function, but what is actually obtained is ${typeof value}`
      )
      return
    }
    const delay = arg ? Number(arg) : 500
    const debouncedFunc = throttle(value, delay)
    el.addEventListener('click', debouncedFunc)
    el._debouncedFunc = debouncedFunc
  },

  unmounted(el) {
    if (el._debouncedFunc) {
      el.removeEventListener('click', el._debouncedFunc)
      delete el._debouncedFunc
    }
  },
}
