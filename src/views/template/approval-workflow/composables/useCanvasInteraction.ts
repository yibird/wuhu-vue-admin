import {
  computed,
  onMounted,
  onUnmounted,
  shallowRef,
  type Ref,
  type ShallowRef,
} from 'vue'
import { useRangeSelection } from '@/composables/useRangeSelection'

export interface ApprovalCanvasInteractionActions {
  duplicateSelected: () => void
  removeSelected: () => void
  selectMany: (ids: string[]) => void
}

function getNodeId(element: HTMLElement) {
  return element.dataset.approvalNodeId ?? ''
}

export function useApprovalCanvasInteraction(
  canvasRef: Readonly<ShallowRef<HTMLElement | null>>,
  selectedIds: Readonly<Ref<readonly string[]>>,
  actions: ApprovalCanvasInteractionActions,
  getScrollElement?: () => HTMLElement | null
) {
  const zoom = shallowRef(1)
  const nodeTargets = shallowRef<HTMLElement[]>([])
  const rangeContainer = computed(() => getScrollElement?.() ?? canvasRef.value)
  const selectedNodeTargets = computed(() => {
    const ids = new Set(selectedIds.value)
    return nodeTargets.value.filter((element) => ids.has(getNodeId(element)))
  })

  let lastCopyShortcutAt = 0

  const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`)
  const canvasContentStyle = computed(() => ({
    transform: `scale(${zoom.value})`,
  }))

  function refreshNodeTargets() {
    const container = rangeContainer.value
    nodeTargets.value = container
      ? Array.from(
          container.querySelectorAll<HTMLElement>('[data-approval-node-id]')
        )
      : []
  }

  const rangeSelection = useRangeSelection<HTMLElement>({
    container: rangeContainer,
    getKey: getNodeId,
    multiple: true,
    observeScroll: true,
    selected: selectedNodeTargets,
    strategy: 'intersect',
    targets: nodeTargets,
    threshold: 6,
    onChange: (elements) => {
      actions.selectMany(elements.map(getNodeId).filter(Boolean))
      canvasRef.value?.focus({ preventScroll: true })
    },
    onStart: () => {
      refreshNodeTargets()
      canvasRef.value?.focus({ preventScroll: true })
    },
  })

  const marqueeSelectedIds = computed(() =>
    rangeSelection.previewSelected.value.map(getNodeId).filter(Boolean)
  )

  function setZoom(value: number) {
    zoom.value = Math.min(1.6, Math.max(0.6, Number(value.toFixed(2))))
  }

  function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false
    if (target.isContentEditable) return true
    return Boolean(
      target.closest(
        'input, textarea, select, [contenteditable="true"], .ant-select, .ant-input, .ant-input-number, .ant-modal'
      )
    )
  }

  function isCanvasShortcutActive() {
    const canvas = canvasRef.value
    if (!canvas) return false
    const activeElement = document.activeElement

    return (
      activeElement === canvas ||
      (activeElement instanceof HTMLElement && canvas.contains(activeElement))
    )
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isCanvasShortcutActive()) return
    if (isEditableTarget(event.target)) return
    const key = event.key.toLowerCase()
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      actions.removeSelected()
      return
    }
    if ((event.ctrlKey || event.metaKey) && key === 'c') {
      event.preventDefault()
      duplicateSelectedFromCopyShortcut()
      return
    }
    if ((event.ctrlKey || event.metaKey) && key === 'd') {
      event.preventDefault()
      actions.duplicateSelected()
    }
  }

  function duplicateSelectedFromCopyShortcut() {
    const now = Date.now()
    if (now - lastCopyShortcutAt < 80) return
    lastCopyShortcutAt = now
    actions.duplicateSelected()
  }

  function handleCopy(event: ClipboardEvent) {
    if (!isCanvasShortcutActive()) return
    if (isEditableTarget(event.target)) return
    event.preventDefault()
    duplicateSelectedFromCopyShortcut()
  }

  function handleWheel(event: WheelEvent) {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    setZoom(zoom.value + (event.deltaY > 0 ? -0.08 : 0.08))
  }

  onMounted(() => {
    refreshNodeTargets()
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('copy', handleCopy)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('copy', handleCopy)
  })

  return {
    canvasContentStyle,
    marqueeSelectedIds,
    selecting: rangeSelection.isSelecting,
    selectionRect: rangeSelection.selectionStyle,
    zoom,
    zoomLabel,
    handleWheel,
    setZoom,
  }
}
