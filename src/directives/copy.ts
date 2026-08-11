import { message } from 'antdv-next'
import type { Directive } from 'vue'

interface CopyElement extends HTMLElement {
  _copyHandler?: () => void
}

function createCopyHandler(text: string) {
  return () => {
    if (!text) return
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('复制成功')
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        message.error(`复制失败: ${errorMessage}`)
      })
  }
}

export const copy: Directive<CopyElement, string> = {
  mounted(el, binding) {
    el.style.cursor = 'pointer'
    const handler = createCopyHandler(binding.value)
    el.addEventListener('click', handler)
    el._copyHandler = handler
  },
  updated(el, binding) {
    if (el._copyHandler) {
      el.removeEventListener('click', el._copyHandler)
    }
    const handler = createCopyHandler(binding.value)
    el.addEventListener('click', handler)
    el._copyHandler = handler
  },
  unmounted(el) {
    if (el._copyHandler) {
      el.removeEventListener('click', el._copyHandler)
      delete el._copyHandler
    }
  },
}
