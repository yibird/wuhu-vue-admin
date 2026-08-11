import type { Ref } from 'vue'
import type { ChartDataSource, ChartWidget } from '../types'
import {
  duplicateWidgetById,
  duplicateWidgetsByIds,
  removeWidgetById,
  removeWidgetsByIds,
} from './widgetCollection'
import { getSourceWidgetDefaults, reorderByIds } from './widgetFactory'

interface UseChartWidgetActionsOptions {
  dataSources: Ref<ChartDataSource[]>
  selectedWidgetIds: Ref<string[]>
  widgets: Ref<ChartWidget[]>
}

export function useChartWidgetActions(options: UseChartWidgetActionsOptions) {
  function updateWidget(id: string, patch: Partial<ChartWidget>) {
    const nextSource =
      patch.sourceId === undefined
        ? undefined
        : options.dataSources.value.find(
            (source) => source.id === patch.sourceId
          )
    const sourceDefaults = nextSource ? getSourceWidgetDefaults(nextSource) : {}

    options.widgets.value = options.widgets.value.map((widget) =>
      widget.id === id ? { ...widget, ...sourceDefaults, ...patch } : widget
    )
  }

  function reorderWidgets(orderedIds: string[], selectedId: string) {
    options.widgets.value = reorderByIds(options.widgets.value, orderedIds)
    options.selectedWidgetIds.value = selectedId ? [selectedId] : []
  }

  function duplicateWidget(id: string) {
    const update = duplicateWidgetById(options.widgets.value, id)
    if (!update) return

    options.widgets.value = update.widgets
    options.selectedWidgetIds.value = update.selectedIds
  }

  function duplicateSelectedWidgets() {
    const update = duplicateWidgetsByIds(
      options.widgets.value,
      options.selectedWidgetIds.value
    )
    if (!update) return

    options.widgets.value = update.widgets
    options.selectedWidgetIds.value = update.selectedIds
  }

  function removeWidget(id: string) {
    const update = removeWidgetById(
      options.widgets.value,
      options.selectedWidgetIds.value,
      id
    )
    options.widgets.value = update.widgets
    options.selectedWidgetIds.value = update.selectedIds
  }

  function removeSelectedWidgets() {
    const update = removeWidgetsByIds(
      options.widgets.value,
      options.selectedWidgetIds.value
    )
    if (!update) return

    options.widgets.value = update.widgets
    options.selectedWidgetIds.value = update.selectedIds
  }

  return {
    duplicateSelectedWidgets,
    duplicateWidget,
    removeSelectedWidgets,
    removeWidget,
    reorderWidgets,
    updateWidget,
  }
}
