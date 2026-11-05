export interface GoalStage {
  /** 统计口径 */
  label: string
  /** 完成百分比 */
  percent: number
  /** 已完成金额 */
  value: number
  /** 百分比文字色 */
  tone: string
  /** 进度条底色 */
  bar: string
}
