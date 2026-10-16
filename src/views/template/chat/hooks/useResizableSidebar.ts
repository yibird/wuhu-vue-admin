import {
  computed,
  onBeforeUnmount,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

interface UseResizableSidebarOptions {
  width: Ref<number>
  minWidth: MaybeRefOrGetter<number>
  maxWidth: MaybeRefOrGetter<number>
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function useResizableSidebar(options: UseResizableSidebarOptions) {
  const isResizing = shallowRef(false)
  let pointerId: number | undefined
  let resizeHandle: HTMLElement | undefined
  /**
   * 拖拽期间的宽度载体,即侧边栏根元素
   *
   * 拖拽手柄是它的直接子节点,因此从手柄的父节点取,不必再向外传元素引用。
   */
  let resizeTarget: HTMLElement | undefined
  let startX = 0
  let startWidth = 0
  /** 本次拖拽的最新目标宽度,按帧写入 DOM,拖拽结束后才写回响应式宽度 */
  let latestWidth: number | undefined
  let frameId: number | undefined

  const sidebarStyle = computed(() => ({
    maxWidth: `${toValue(options.maxWidth)}px`,
    minWidth: `${toValue(options.minWidth)}px`,
    width: `${options.width.value}px`,
  }))

  function setWidth(width: number) {
    options.width.value = clamp(
      width,
      toValue(options.minWidth),
      toValue(options.maxWidth)
    )
  }

  /**
   * 把本帧最新的宽度直接写到元素上
   *
   * pointermove 的触发频率远高于帧率,如果每次都改响应式宽度,
   * 绑定在侧边栏上的样式会重算,进而让整个聊天页(导航、会话列表、消息区、多个弹窗)重渲染一次。
   * 直接写样式则每个帧只有一次样式写入和一次浏览器布局,不产生组件更新。
   */
  function flushWidth() {
    frameId = undefined
    if (latestWidth === undefined || !resizeTarget) return
    resizeTarget.style.width = `${latestWidth}px`
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

    const handle = event.currentTarget
    if (!(handle instanceof HTMLElement)) return

    pointerId = event.pointerId
    resizeHandle = handle
    resizeTarget = handle.parentElement ?? undefined
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

    latestWidth = clamp(
      startWidth + event.clientX - startX,
      toValue(options.minWidth),
      toValue(options.maxWidth)
    )
    if (frameId === undefined) frameId = requestAnimationFrame(flushWidth)
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

    if (frameId !== undefined) {
      cancelAnimationFrame(frameId)
      frameId = undefined
    }
    // 拖拽结束才写回响应式宽度:期间的宽度变化都只落在 DOM 上
    if (latestWidth !== undefined) {
      setWidth(latestWidth)
      latestWidth = undefined
    }

    isResizing.value = false
    pointerId = undefined
    resizeHandle = undefined
    resizeTarget = undefined
    cleanupListeners()
    unlockResizeCursor()
  }

  watch(
    () => [
      options.width.value,
      toValue(options.minWidth),
      toValue(options.maxWidth),
    ],
    ([width]) => {
      const nextWidth = clamp(
        width,
        toValue(options.minWidth),
        toValue(options.maxWidth)
      )
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
