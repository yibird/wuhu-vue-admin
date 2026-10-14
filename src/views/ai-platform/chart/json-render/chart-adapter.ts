import { createWidgetChartOption } from '@/views/template/chart-designer/chart-options'
import { useEChartsTheme } from '@/theme'

import type { ChartWidget } from '@/views/template/chart-designer/types'
import type { AiChartType } from './catalog'

/**
 * 图表节点声明。
 */
export interface ChartNode {
  /**
   * @desc 图表类型
   */
  type: AiChartType
  /**
   * @desc 类目-数值 数据
   */
  rows: Array<{ label: string; value: number }>
  /**
   * @desc 图表标题
   */
  title?: string
}

/**
 * 把生成式 UI 的图表节点转换为 ECharts 配置。
 * 复用 chart-designer 的选项引擎,从而直接获得全部图表类型与主题联动。
 */
export function useChartAdapter() {
  const { baseChartOption, getEChartsColor } = useEChartsTheme()

  return (node: ChartNode) => {
    const widget: ChartWidget = {
      id: 'ai-chart',
      title: node.title ?? '',
      subtitle: '',
      kind: 'chart',
      chartType: node.type,
      sourceId: 'ai',
      dimension: 'label',
      measure: 'value',
      colSpan: 1,
      rowSpan: 1,
      accent: '',
      insight: '',
    }

    return createWidgetChartOption({
      baseOption: baseChartOption.value,
      getColor: getEChartsColor,
      rows: node.rows,
      widget,
    })
  }
}
