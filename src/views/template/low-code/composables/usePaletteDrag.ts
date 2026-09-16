import { ref } from 'vue'

/** 组件面板拖拽 MIME */
export const PALETTE_MIME = 'application/x-wuhu-low-code-material'

/** 当前从组件面板拖拽的组件类型（跨组件共享） */
export const paletteDragType = ref<string | undefined>(undefined)
export const paletteDragging = ref(false)

export function startPaletteDrag(type: string, event: DragEvent) {
  paletteDragType.value = type
  paletteDragging.value = true
  event.dataTransfer?.setData(PALETTE_MIME, type)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}

export function endPaletteDrag() {
  paletteDragType.value = undefined
  paletteDragging.value = false
}
