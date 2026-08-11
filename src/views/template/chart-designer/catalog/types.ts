import type { ChartPaletteItem, ChartType, ChartWidgetKind } from '../types'

export interface ChartControlDefinition {
  type: ChartType | ChartWidgetKind
  kind: ChartWidgetKind
  title: string
  description: string
  icon: string
  defaultColSpan: number
  defaultRowSpan: number
}

export type ChartCatalogItem = ChartControlDefinition

export function toPaletteItem(item: ChartCatalogItem): ChartPaletteItem {
  return {
    description: item.description,
    icon: item.icon,
    kind: item.kind,
    title: item.title,
    type: item.type,
  }
}
