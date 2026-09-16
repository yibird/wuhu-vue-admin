import { debounce as createDebounced } from 'es-toolkit'
import type { Directive } from 'vue'

type EventCallback = (event: Event) => unknown

interface CancellableEventListener extends EventListener {
  cancel: () => void
}

interface DebounceContext {
  callback: EventCallback
  event: string
  wait: number
  listener: CancellableEventListener
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

function removeContext(el: HTMLElement) {
  const context = contexts.get(el)
  if (!context) return

  el.removeEventListener(context.event, context.listener)
  context.listener.cancel()
  contexts.delete(el)
}

function mountContext(el: HTMLElement, callback: EventCallback, arg?: string) {
  const event = resolveEvent(arg)
  const wait = resolveDelay(arg)
  const listener = createDebounced((domEvent: Event) => {
    contexts.get(el)?.callback(domEvent)
  }, wait) as CancellableEventListener

  contexts.set(el, { callback, event, wait, listener })
  el.addEventListener(event, listener)
}

export const debounce: Directive<HTMLElement, EventCallback> = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[v-debounce]: value must be a function')
      return
    }

    mountContext(el, binding.value, binding.arg)
  },

  updated(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[v-debounce]: value must be a function')
      removeContext(el)
      return
    }

    const context = contexts.get(el)
    const event = resolveEvent(binding.arg)
    const wait = resolveDelay(binding.arg)
    if (context?.event === event && context.wait === wait) {
      context.callback = binding.value
      return
    }

    removeContext(el)
    mountContext(el, binding.value, binding.arg)
  },

  unmounted(el) {
    removeContext(el)
  },
}
