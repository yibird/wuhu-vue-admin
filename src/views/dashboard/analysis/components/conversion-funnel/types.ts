/**
 * 漏斗阶段
 */
export interface FunnelStage {
  id: string
  title: string
  /** 阶段人数 */
  value: string
  /** 阶段转化率 */
  rate: number
  trend: string
  /** 趋势文案的颜色 */
  toneClass: string
  /** 进度条的渐变颜色 */
  fillClass: string
}

/**
 * 运营信号
 */
export interface FunnelInsight {
  id: string
  label: string
  value: string
  description: string
  icon: string
  /** 图标容器的背景与文字颜色 */
  iconClass: string
}

/**
 * 最终成交摘要
 */
export interface FunnelSummary {
  title: string
  value: string
  unit: string
  description: string
  rateLabel: string
  rate: string
  /** 总体转化率对应的进度条宽度 */
  progress: number
}
