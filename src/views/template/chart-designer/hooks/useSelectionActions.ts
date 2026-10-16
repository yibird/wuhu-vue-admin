import type { Ref } from 'vue'
import type { ChartWidget } from '../types'

interface UseChartSelectionActionsOptions {
  selectedWidgetIds: Ref<string[]>
  widgets: Ref<ChartWidget[]>
}

export function useChartSelectionActions(
  options: UseChartSelectionActionsOptions
) {
  function selectWidget(id: string) {
    options.selectedWidgetIds.value = id ? [id] : []
  }

  function selectManyWidgets(ids: readonly string[]) {
    const availableIds = new Set(
      options.widgets.value.map((widget) => widget.id)
    )
    const seen = new Set<string>()
    options.selectedWidgetIds.value = ids.filter((id) => {
      if (!availableIds.has(id) || seen.has(id)) return false
      seen.add(id)
      return true
    })
  }

  function clearSelection() {
    options.selectedWidgetIds.value = []
  }

  return { clearSelection, selectManyWidgets, selectWidget }
}
