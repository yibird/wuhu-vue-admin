import { computed, onBeforeUnmount, onMounted, type Ref } from 'vue'
import { useRangeSelection } from '@/composables/useRangeSelection'
import type { ChartWidget } from '../types'

interface UseChartCanvasSelectionOptions {
  canvas: Readonly<Ref<HTMLElement | null>>
  selectedWidgetIds: Readonly<Ref<readonly string[]>>
  widgets: Readonly<Ref<readonly ChartWidget[]>>
  onClearSelection: () => void
  onDuplicateSelected: () => void
  onRemoveSelected: () => void
  onSelectMany: (ids: readonly string[]) => void
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  const tagName = target.tagName.toLowerCase()
  return (
    ['input', 'select', 'textarea'].includes(tagName) ||
    target.isContentEditable ||
    !!target.closest('[contenteditable="true"], .ant-input, .ant-select')
  )
}

function getWidgetId(element: HTMLElement) {
  return element.dataset.chartWidgetId ?? ''
}

export function useChartCanvasSelection(
  options: UseChartCanvasSelectionOptions
) {
  const widgetTargets = computed(() => {
    const canvas = options.canvas.value
    if (!canvas || !options.widgets.value.length) return []

    const availableIds = new Set(
      options.widgets.value.map((widget) => widget.id)
    )
    return Array.from(
      canvas.querySelectorAll<HTMLElement>('[data-chart-widget-id]')
    ).filter((element) => availableIds.has(getWidgetId(element)))
  })
  const selectedWidgetTargets = computed(() => {
    const selectedIds = new Set(options.selectedWidgetIds.value)
    return widgetTargets.value.filter((element) =>
      selectedIds.has(getWidgetId(element))
    )
  })

  const rangeSelection = useRangeSelection<HTMLElement>({
    container: options.canvas,
    getKey: getWidgetId,
    multiple: true,
    observeScroll: true,
    selected: selectedWidgetTargets,
    targets: widgetTargets,
    onChange: (elements) => {
      const ids = elements.map(getWidgetId).filter(Boolean)
      if (!ids.length) {
        options.onClearSelection()
        return
      }
      options.onSelectMany(ids)
    },
  })

  const hasSelection = computed(
    () => options.selectedWidgetIds.value.length > 0
  )
  const selectedCount = computed(() => options.selectedWidgetIds.value.length)
  const activeSelectedWidgetIds = computed(() => {
    if (!rangeSelection.isSelecting.value) {
      return options.selectedWidgetIds.value
    }

    return rangeSelection.activeSelected.value.map(getWidgetId).filter(Boolean)
  })

  function handleKeydown(event: KeyboardEvent) {
    if (isEditableTarget(event.target) || selectedCount.value === 0) return

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      options.onDuplicateSelected()
      return
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      options.onRemoveSelected()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    activeSelectedWidgetIds,
    hasSelection,
    isMarqueeSelecting: rangeSelection.isSelecting,
    marqueeStyle: rangeSelection.selectionStyle,
    selectedCount,
  }
}
