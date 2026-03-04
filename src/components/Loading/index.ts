import { createApp, type App } from 'vue'
import Loading from './src/index.vue'

let instance: App<Element> | null = null
let container: HTMLElement | null = null

export function createLoading() {
  container = document.createElement('div')
  document.body.appendChild(container)

  instance = createApp(Loading, { description: import.meta.env.VITE_APP_NAME })
  instance.mount(container)
}

function destroyLoading() {
  instance?.unmount()
  container?.remove()
  instance = null
  container = null
}

export function hideLoading() {
  if (!instance) return
  if (container) {
    container.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    container.style.opacity = '0'
    const onTransitionEnd = () => {
      destroyLoading()
      container?.removeEventListener('transitionend', onTransitionEnd)
    }
    container.addEventListener('transitionend', onTransitionEnd)
    setTimeout(destroyLoading, 500)
    return
  }
  destroyLoading()
}
