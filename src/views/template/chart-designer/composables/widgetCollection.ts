import type { ChartWidget } from '../types'
import { createDesignerId } from './ids'

export interface WidgetCollectionUpdate {
  selectedIds: string[]
  widgets: ChartWidget[]
}

export function duplicateWidgetById(
  widgets: readonly ChartWidget[],
  id: string
): WidgetCollectionUpdate | undefined {
  const widget = widgets.find((item) => item.id === id)
  if (!widget) return undefined

  const copiedWidget = copyWidget(widget)
  return {
    selectedIds: [copiedWidget.id],
    widgets: [...widgets, copiedWidget],
  }
}

export function duplicateWidgetsByIds(
  widgets: readonly ChartWidget[],
  selectedIds: readonly string[]
): WidgetCollectionUpdate | undefined {
  const selectedIdSet = new Set(selectedIds)
  const copiedWidgets = widgets
    .filter((widget) => selectedIdSet.has(widget.id))
    .map(copyWidget)

  if (copiedWidgets.length === 0) return undefined

  return {
    selectedIds: copiedWidgets.map((widget) => widget.id),
    widgets: [...widgets, ...copiedWidgets],
  }
}

export function removeWidgetById(
  widgets: readonly ChartWidget[],
  selectedIds: readonly string[],
  id: string
): WidgetCollectionUpdate {
  const nextWidgets = widgets.filter((widget) => widget.id !== id)
  return {
    selectedIds: selectedIds.includes(id)
      ? getDefaultSelection(nextWidgets)
      : [...selectedIds],
    widgets: nextWidgets,
  }
}

export function removeWidgetsByIds(
  widgets: readonly ChartWidget[],
  selectedIds: readonly string[]
): WidgetCollectionUpdate | undefined {
  if (selectedIds.length === 0) return undefined

  const selectedIdSet = new Set(selectedIds)
  const nextWidgets = widgets.filter((widget) => !selectedIdSet.has(widget.id))

  return {
    selectedIds: getDefaultSelection(nextWidgets),
    widgets: nextWidgets,
  }
}

function copyWidget(widget: ChartWidget): ChartWidget {
  return {
    ...widget,
    id: createDesignerId('widget'),
    title: `${widget.title} 副本`,
  }
}

function getDefaultSelection(widgets: readonly ChartWidget[]) {
  return widgets[0] ? [widgets[0].id] : []
}
