import { use } from 'echarts/core'
import {
  BarChart,
  BoxplotChart,
  CandlestickChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  PieChart,
  PictorialBarChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  TreemapChart,
} from 'echarts/charts'
import {
  DatasetComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
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
 * 注册 ECharts 模块并注入图表默认选项
 *
 * 注册会把 echarts core、渲染器与图表类型一并带进当前 chunk,因此不在应用启动时执行:
 * 由图表组件在 setup 阶段同步调用,首屏不再下载 echarts,图表页在首次渲染前完成注册。
 * 必须在 VChart 初始化图表之前调用,重复调用不会重复注册。
 */
export function useECharts() {
  if (!registered) {
    registered = true
    use([
      CanvasRenderer,
      BarChart,
      BoxplotChart,
      CandlestickChart,
      DatasetComponent,
      FunnelChart,
      GaugeChart,
      GraphChart,
      GraphicComponent,
      GridComponent,
      HeatmapChart,
      LegendComponent,
      LineChart,
      PieChart,
      PictorialBarChart,
      RadarChart,
      RadarComponent,
      SankeyChart,
      ScatterChart,
      SunburstChart,
      TooltipComponent,
      TreemapChart,
      VisualMapComponent,
    ])
  }

  provide(INIT_OPTIONS_KEY, initOptions)
  provide(UPDATE_OPTIONS_KEY, updateOptions)
}
