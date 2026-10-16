import type { LogJson } from '@/apis'

/**
 * 日志详情字段
 */
export interface LogDetailField {
  /**
   * @desc 字段名
   */
  label: string
  /**
   * @desc 字段值,缺省时展示占位符
   */
  value?: string | number | null
  /**
   * @desc 占用的列数
   * @default 1
   */
  span?: number
}

/**
 * 日志详情中的 JSON 分块
 */
export interface LogDetailTab {
  /**
   * @desc 分块标识
   */
  key: string
  /**
   * @desc 分块名称
   */
  label: string
  /**
   * @desc JSON 数据
   */
  data: LogJson
}

/**
 * 日志详情中的 JSON 分组,组内以 tab 切换
 */
export interface LogDetailGroup {
  /**
   * @desc 分组标题
   */
  title: string
  /**
   * @desc 分组内的分块
   */
  tabs: LogDetailTab[]
}
