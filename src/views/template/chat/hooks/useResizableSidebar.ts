import { computed, onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'

interface UseResizableSidebarOptions {
  width: Ref<number>
  minWidth: number
  maxWidth: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function useResizableSidebar(options: UseResizableSidebarOptions) {
  const isResizing = shallowRef(false)
  let pointerId: number | undefined
  let resizeHandle: HTMLElement | undefined
  let startX = 0
  let startWidth = 0

  const sidebarStyle = computed(() => ({
    maxWidth: `${options.maxWidth}px`,
    minWidth: `${options.minWidth}px`,
    width: `${options.width.value}px`,
  }))

  function setWidth(width: number) {
    options.width.value = clamp(width, options.minWidth, options.maxWidth)
  }

  function lockResizeCursor() {
    document.body.classList.add('chat-sidebar-resizing')
  }

  function unlockResizeCursor() {
    document.body.classList.remove('chat-sidebar-resizing')
  }

  function cleanupListeners() {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', stopResize)
    window.removeEventListener('pointercancel', stopResize)
  }

  function startResize(event: PointerEvent) {
    if (event.button !== 0 || !event.isPrimary) return

    pointerId = event.pointerId
    resizeHandle = event.currentTarget as HTMLElement
    startX = event.clientX
    startWidth = options.width.value
    isResizing.value = true

    resizeHandle.setPointerCapture(pointerId)
    lockResizeCursor()
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)
    event.preventDefault()
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isResizing.value || event.pointerId !== pointerId) return

    setWidth(startWidth + event.clientX - startX)
    event.preventDefault()
  }

  function stopResize(event?: PointerEvent) {
    if (event && pointerId !== undefined && event.pointerId !== pointerId)
      return

    if (resizeHandle && pointerId !== undefined) {
      try {
        resizeHandle.releasePointerCapture(pointerId)
      } catch {
        // Pointer capture can be released by the browser when the pointer leaves.
      }
    }

    isResizing.value = false
    pointerId = undefined
    resizeHandle = undefined
    cleanupListeners()
    unlockResizeCursor()
  }

  watch(
    () => options.width.value,
    (width) => {
      const nextWidth = clamp(width, options.minWidth, options.maxWidth)
      if (nextWidth !== width) {
        options.width.value = nextWidth
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(stopResize)

  return {
    isResizing,
    sidebarStyle,
    setWidth,
    startResize,
  }
}
