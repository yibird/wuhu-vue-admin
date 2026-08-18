import { createApp, type App } from 'vue'
import Loading from './index.vue'
import { appStore } from '@/store'

let instance: App<Element> | null = null
let container: HTMLElement | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let isHiding = false

const clearHideTimer = () => {
  if (!hideTimer) return
  clearTimeout(hideTimer)
  hideTimer = null
}
function destroyLoading() {
  clearHideTimer()
  instance?.unmount()
  container?.remove()
  instance = null
  container = null
  isHiding = false
}
export function createLoading() {
  if (typeof document === 'undefined') return

  if (instance) {
    clearHideTimer()
    isHiding = false
    if (container) {
      container.style.transition = ''
      container.style.opacity = '1'
    }
    return
  }

  container = document.createElement('div')
  document.body.appendChild(container)
  const store = appStore()

  instance = createApp(Loading, {
    description: import.meta.env.VITE_APP_NAME,
    fullScreen: true,
    animation: store.animation.loadingAnimation,
  })
  instance.mount(container)
}
export function hideLoading() {
  if (!instance || isHiding) return

  if (!container) {
    destroyLoading()
    return
  }

  isHiding = true
  const currentContainer = container

  currentContainer.style.transition =
    'opacity var(--w-motion-duration-slower) var(--w-motion-ease-exit), visibility var(--w-motion-duration-slower) var(--w-motion-ease-exit)'
  currentContainer.style.opacity = '0'
  currentContainer.style.visibility = 'hidden'

  const onTransitionEnd = () => {
    currentContainer.removeEventListener('transitionend', onTransitionEnd)
    destroyLoading()
  }

  currentContainer.addEventListener('transitionend', onTransitionEnd, {
    once: true,
  })
  hideTimer = setTimeout(() => {
    currentContainer.removeEventListener('transitionend', onTransitionEnd)
    destroyLoading()
  }, 800)
}
