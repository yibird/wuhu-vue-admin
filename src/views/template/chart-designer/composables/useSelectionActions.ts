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
    options.selectedWidgetIds.value = ids.filter((id, index) => {
      return availableIds.has(id) && ids.indexOf(id) === index
    })
  }

  function clearSelection() {
    options.selectedWidgetIds.value = []
  }

  return { clearSelection, selectManyWidgets, selectWidget }
}
