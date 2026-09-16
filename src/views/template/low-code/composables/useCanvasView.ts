import { computed, onMounted, ref } from 'vue'
import type { CSSProperties, ComputedRef, Ref } from 'vue'

export interface CanvasViewApi {
  zoom: Ref<number>
  panX: Ref<number>
  panY: Ref<number>
  showRulers: Ref<boolean>
  showGrid: Ref<boolean>
  panning: Ref<boolean>
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setZoom: (value: number) => void
  zoomAt: (clientX: number, clientY: number, factor: number) => void
  handleWheel: (event: WheelEvent) => void
  fit: () => void
  /** 保持当前缩放：画布小于视口时居中显示，否则对齐左上角 */
  resetPosition: () => void
  startPan: (event: PointerEvent) => void
  updatePan: (event: PointerEvent) => void
  endPan: () => void
  stageStyle: ComputedRef<CSSProperties>
}

const MIN_ZOOM = 0.1
const MAX_ZOOM = 4
/** 画布四周允许留白 / 可滚动到的最小边界 */
const EDGE_MARGIN = 24

export interface CanvasViewOptions {
  viewport: Ref<HTMLElement | undefined>
  /** 配置的设备尺寸（用于预设/自定义设置） */
  deviceSize: () => { width: number; height: number }
  /**
   * 画布实际渲染尺寸（页面内容可能高于设备最小高度）。
   * 用于平移边界计算，避免内容超出设备配置高度时无法向下滚动。
   */
  contentSize?: () => { width: number; height: number } | undefined
}

export function useCanvasView(options: CanvasViewOptions): CanvasViewApi {
  const zoom = ref(1)
  const panX = ref(EDGE_MARGIN)
  const panY = ref(EDGE_MARGIN)
  const showRulers = ref(true)
  const showGrid = ref(false)
  const panning = ref(false)

  const panOrigin = { x: 0, y: 0, panX: 0, panY: 0 }

  /** 优先使用实际渲染尺寸，回退到配置尺寸 */
  function measureContent() {
    const measured = options.contentSize?.()
    if (measured && measured.width > 0 && measured.height > 0) {
      return measured
    }
    return options.deviceSize()
  }

  function clampZoom(value: number) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(3))))
  }

  /**
   * 平移边界约束：
   * - 画布可居中，也可小幅平移，但不能被完全滚出视口；
   * - 画布比视口小（含边距）时，最大偏移即居中位置。
   */
  function clampPan() {
    const viewport = options.viewport.value
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const { width, height } = measureContent()
    if (!rect.width || !rect.height || !width || !height) return
    const contentWidth = width * zoom.value
    const contentHeight = height * zoom.value
    const maxX = Math.max(EDGE_MARGIN, (rect.width - contentWidth) / 2)
    const maxY = Math.max(EDGE_MARGIN, (rect.height - contentHeight) / 2)
    const minX = Math.min(maxX, rect.width - contentWidth - EDGE_MARGIN)
    const minY = Math.min(maxY, rect.height - contentHeight - EDGE_MARGIN)
    panX.value = Math.round(Math.min(maxX, Math.max(minX, panX.value)))
    panY.value = Math.round(Math.min(maxY, Math.max(minY, panY.value)))
  }

  function setZoom(value: number) {
    zoom.value = clampZoom(value)
    clampPan()
  }

  function zoomAt(clientX: number, clientY: number, factor: number) {
    const viewport = options.viewport.value
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const nextZoom = clampZoom(zoom.value * factor)
    if (nextZoom === zoom.value) return
    const offsetX = clientX - rect.left
    const offsetY = clientY - rect.top
    const worldX = (offsetX - panX.value) / zoom.value
    const worldY = (offsetY - panY.value) / zoom.value
    zoom.value = nextZoom
    panX.value = offsetX - worldX * nextZoom
    panY.value = offsetY - worldY * nextZoom
    clampPan()
  }

  function zoomIn() {
    const viewport = options.viewport.value
    if (!viewport) return setZoom(zoom.value * 1.1)
    const rect = viewport.getBoundingClientRect()
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.1)
  }

  function zoomOut() {
    const viewport = options.viewport.value
    if (!viewport) return setZoom(zoom.value / 1.1)
    const rect = viewport.getBoundingClientRect()
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1 / 1.1)
  }

  function resetZoom() {
    setZoom(1)
  }

  /** 适应画布：缩放至完整可见并居中 */
  function fit() {
    const viewport = options.viewport.value
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const { width, height } = measureContent()
    if (!rect.width || !rect.height || !width || !height) return
    const padding = EDGE_MARGIN * 2
    const nextZoom = clampZoom(
      Math.min(
        (rect.width - padding) / width,
        (rect.height - padding) / height,
        1.5
      )
    )
    zoom.value = nextZoom
    resetPosition()
  }

  /** 保持当前缩放：画布小于视口时居中，否则对齐到左上角 */
  function resetPosition() {
    const viewport = options.viewport.value
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const { width, height } = measureContent()
    if (!rect.width || !rect.height || !width || !height) return
    const contentWidth = width * zoom.value
    const contentHeight = height * zoom.value
    panX.value =
      contentWidth <= rect.width - EDGE_MARGIN * 2
        ? Math.round((rect.width - contentWidth) / 2)
        : EDGE_MARGIN
    panY.value =
      contentHeight <= rect.height - EDGE_MARGIN * 2
        ? Math.round((rect.height - contentHeight) / 2)
        : EDGE_MARGIN
    clampPan()
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault()
    if (event.ctrlKey || event.metaKey) {
      const factor = event.deltaY > 0 ? 0.94 : 1.06
      zoomAt(event.clientX, event.clientY, factor)
      return
    }
    panX.value -= event.deltaX
    panY.value -= event.deltaY
    clampPan()
  }

  function startPan(event: PointerEvent) {
    panning.value = true
    panOrigin.x = event.clientX
    panOrigin.y = event.clientY
    panOrigin.panX = panX.value
    panOrigin.panY = panY.value
  }

  function updatePan(event: PointerEvent) {
    if (!panning.value) return
    panX.value = panOrigin.panX + (event.clientX - panOrigin.x)
    panY.value = panOrigin.panY + (event.clientY - panOrigin.y)
    clampPan()
  }

  function endPan() {
    panning.value = false
  }

  const stageStyle = computed<CSSProperties>(() => ({
    transform: `translate3d(${panX.value}px, ${panY.value}px, 0) scale(${zoom.value})`,
    transformOrigin: '0 0',
  }))

  onMounted(() => {
    requestAnimationFrame(() => resetPosition())
  })

  return {
    zoom,
    panX,
    panY,
    showRulers,
    showGrid,
    panning,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    zoomAt,
    handleWheel,
    fit,
    resetPosition,
    startPan,
    updatePan,
    endPan,
    stageStyle,
  }
}
