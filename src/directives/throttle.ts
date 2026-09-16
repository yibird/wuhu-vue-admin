import { throttle as createThrottled } from 'es-toolkit'
import type { Directive } from 'vue'

type EventCallback = (event: Event) => unknown

interface CancellableEventListener extends EventListener {
  cancel: () => void
}

interface ThrottleContext {
  callback: EventCallback
  event: string
  wait: number
  listener: CancellableEventListener
}

const contexts = new WeakMap<HTMLElement, ThrottleContext>()

function getDelay(arg?: string) {
  const delay = Number(arg)
  return Number.isFinite(delay) && delay > 0 ? delay : 500
}

function getEvent(arg?: string) {
  return arg && !Number.isFinite(Number(arg)) ? arg : 'click'
}

function removeContext(el: HTMLElement) {
  const context = contexts.get(el)
  if (!context) return

  el.removeEventListener(context.event, context.listener)
  context.listener.cancel()
  contexts.delete(el)
}

function mountContext(el: HTMLElement, callback: EventCallback, arg?: string) {
  const event = getEvent(arg)
  const wait = getDelay(arg)
  const listener = createThrottled(
    (domEvent: Event) => {
      contexts.get(el)?.callback(domEvent)
    },
    wait,
    { edges: ['leading'] }
  ) as CancellableEventListener

  contexts.set(el, { callback, event, wait, listener })
  el.addEventListener(event, listener)
}

export const throttle: Directive<HTMLElement, EventCallback> = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[v-throttle] value must be a function')
      return
    }

    mountContext(el, binding.value, binding.arg)
  },

  updated(el, binding) {
    if (typeof binding.value !== 'function') {
      console.warn('[v-throttle] value must be a function')
      removeContext(el)
      return
    }

    const context = contexts.get(el)
    const event = getEvent(binding.arg)
    const wait = getDelay(binding.arg)
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
