import type { Directive } from 'vue'

interface ThrottleContext {
  timer?: ReturnType<typeof setTimeout>
  handler: EventListener
}

const contexts = new WeakMap<HTMLElement, ThrottleContext>()

function getDelay(arg?: string) {
  const delay = Number(arg)
  return Number.isFinite(delay) && delay > 0 ? delay : 500
}

export const throttle: Directive<HTMLElement, AnyFunction> = {
  mounted(el, binding) {
    const fn = binding.value

    if (typeof fn !== 'function') {
      console.warn('[v-throttle] value must be a function')
      return
    }

    const delay = getDelay(binding.arg)

    const event =
      binding.arg && isNaN(Number(binding.arg)) ? binding.arg : 'click'
    const handler: EventListener = (...args) => {
      const context = contexts.get(el)
      if (!context) return
      if (context.timer) return
      context.timer = setTimeout(() => {
        context.timer = undefined
      }, delay)
      fn(...args)
    }
    contexts.set(el, {
      handler,
    })
    el.addEventListener(event, handler)
  },

  unmounted(el, binding) {
    const context = contexts.get(el)
    if (!context) return
    const event =
      binding.arg && isNaN(Number(binding.arg)) ? binding.arg : 'click'
    el.removeEventListener(event, context.handler)
    if (context.timer) {
      clearTimeout(context.timer)
    }
    contexts.delete(el)
  },
}
