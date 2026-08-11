import type { Directive } from 'vue'

interface DebounceContext {
  timer?: ReturnType<typeof setTimeout>
  handler: EventListener
  callback: AnyFunction
}

const contexts = new WeakMap<HTMLElement, DebounceContext>()

function resolveDelay(arg?: string) {
  const delay = Number(arg)
  return Number.isFinite(delay) && delay >= 0 ? delay : 500
}

function resolveEvent(arg?: string) {
  if (!arg || Number.isFinite(Number(arg))) {
    return 'click'
  }
  return arg
}

export const debounce: Directive<HTMLElement, AnyFunction> = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[v-debounce]: value must be a function')
      return
    }

    const context: DebounceContext = {
      callback: binding.value,
      handler: (...args: Event[]) => {
        const ctx = contexts.get(el)
        if (!ctx) return
        clearTimeout(ctx.timer)
        ctx.timer = setTimeout(() => {
          ctx.callback(...args)
        }, resolveDelay(binding.arg))
      },
    }

    contexts.set(el, context)
    el.addEventListener(resolveEvent(binding.arg), context.handler)
  },

  updated(el, binding) {
    const context = contexts.get(el)
    if (!context) return
    if (typeof binding.value === 'function') {
      context.callback = binding.value
    }
  },

  unmounted(el, binding) {
    const context = contexts.get(el)
    if (!context) return
    el.removeEventListener(resolveEvent(binding.arg), context.handler)
    if (context.timer) {
      clearTimeout(context.timer)
    }
    contexts.delete(el)
  },
}
