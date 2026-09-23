export interface AnalysisMetric {
  label: string
  value: number
  suffix?: string
  descValue: number
  descPrefix?: string
  descSuffix?: string
  percent: number
  tone: string
}

export interface AnalysisRankItem {
  label: string
  value: number
  suffix?: string
  percent: number
}
