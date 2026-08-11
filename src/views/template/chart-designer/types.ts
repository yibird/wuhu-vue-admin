import type { EChartsCoreOption } from 'echarts/core'

export type ChartDataSourceKind = 'sample' | 'rest' | 'sql' | 'json'
export type ChartDataSourceStatus = 'online' | 'draft' | 'error'
export type ChartFieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'percent'
  | 'currency'
export type ChartWidgetKind = 'kpi' | 'chart' | 'table' | 'note'
export type ChartType =
  | 'area'
  | 'line'
  | 'bar'
  | 'pie'
  | 'funnel'
  | 'scatter'
  | 'radar'
  | 'gauge'
  | 'heatmap'
  | 'treemap'
  | 'sunburst'
  | 'boxplot'
  | 'candlestick'
  | 'graph'
  | 'pictorialBar'
  | 'sankey'
export type ChartScreenTheme = 'midnight' | 'light' | 'matrix'
export type ChartPreviewMode = 'light' | 'dark'
export type ChartAiMessageRole = 'assistant' | 'user'

export interface ChartField {
  key: string
  label: string
  type: ChartFieldType
}

export interface ChartDataRecord {
  [key: string]: string | number | boolean | null | undefined
}

export interface ChartDataSource {
  id: string
  name: string
  kind: ChartDataSourceKind
  status: ChartDataSourceStatus
  description: string
  endpoint: string
  refreshInterval: number
  updatedAt: string
  fields: ChartField[]
  records: ChartDataRecord[]
}

export interface ChartWidget {
  id: string
  title: string
  subtitle: string
  kind: ChartWidgetKind
  chartType?: ChartType
  sourceId: string
  dimension: string
  measure: string
  compareMeasure?: string
  colSpan: number
  rowSpan: number
  accent: string
  insight: string
  formatter?: 'number' | 'currency' | 'percent'
}

export interface ChartScreenConfig {
  title: string
  subtitle: string
  theme: ChartScreenTheme
  canvasBackground: string
  previewMode: ChartPreviewMode
  width: number
  height: number
  autoRefresh: boolean
}

export interface ChartDesignerSchema {
  $schema: string
  version: string
  screen: ChartScreenConfig
  dataSources: ChartDataSource[]
  widgets: ChartWidget[]
}

export interface ChartPaletteItem {
  type: ChartType | ChartWidgetKind
  kind: ChartWidgetKind
  title: string
  description: string
  icon: string
}

export interface ChartAiMessage {
  id: string
  role: ChartAiMessageRole
  content: string
  createdAt: string
}

export interface ChartAiSuggestion {
  id: string
  title: string
  prompt: string
  icon: string
}

export interface ChartDesignerStats {
  sourceCount: number
  widgetCount: number
  onlineSourceCount: number
  refreshLabel: string
}

export interface ChartPreviewPayload {
  spec?: EChartsCoreOption
  value?: string
  trend?: string
  rows?: ChartDataRecord[]
}
