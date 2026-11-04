import { use } from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { INIT_OPTIONS_KEY, UPDATE_OPTIONS_KEY } from 'vue-echarts'
import type { SetOptionOpts } from 'echarts/core'

/** 图表统一使用 canvas 渲染 */
const initOptions = { renderer: 'canvas' } as const
/** 选项整体替换,避免残留上一次的 series */
const updateOptions = { notMerge: true } satisfies SetOptionOpts

let registered = false

/**
 * 注册首页常用的基础图表模块
 *
 * 仪表盘等页面只使用折线/柱状/饼图,单独注册可以避免加载完整的图表类型集合,
 * 降低首屏图表 chunk 的体积与解析时间。
 */
export function useBasicECharts() {
  if (!registered) {
    registered = true
    use([
      CanvasRenderer,
      BarChart,
      LineChart,
      PieChart,
      DatasetComponent,
      GridComponent,
      LegendComponent,
      TooltipComponent,
    ])
  }

  provide(INIT_OPTIONS_KEY, initOptions)
  provide(UPDATE_OPTIONS_KEY, updateOptions)
}
