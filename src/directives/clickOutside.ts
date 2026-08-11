import type { Directive } from 'vue'

type ClickOutsideHandler = (event: MouseEvent) => void

interface ClickOutsideContext {
  handler: (event: MouseEvent) => void
  callback: ClickOutsideHandler
}

const instances = new WeakMap<HTMLElement, ClickOutsideContext>()

export const clickOutside: Directive<HTMLElement, ClickOutsideHandler> = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[v-click-outside]: value must be a function')
      return
    }
    const callback = binding.value

    const handler = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (el === target || el.contains(target)) {
        return
      }
      callback(event)
    }

    instances.set(el, {
      handler,
      callback,
    })

    document.addEventListener('click', handler)
  },

  updated(el, binding) {
    const context = instances.get(el)
    if (!context) return
    if (typeof binding.value !== 'function') {
      return
    }
    context.callback = binding.value
  },

  unmounted(el) {
    const context = instances.get(el)
    if (!context) return
    document.removeEventListener('click', context.handler)
    instances.delete(el)
  },
}
