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
  RadarComponent,
  VisualMapComponent,
} from 'echarts/components'
import { provideEChartsOptions, registerEChartsCore } from './core'
import type { App } from 'vue'

/**
 * 注册图表所需的 ECharts 模块与全局默认选项
 *
 * @param app 应用实例，用于注入 vue-echarts 的默认选项
 */
export function registerECharts(app: App) {
  provideEChartsOptions(app)
  registerEChartsCore()

  use([
    BarChart,
    BoxplotChart,
    CandlestickChart,
    DatasetComponent,
    FunnelChart,
    GaugeChart,
    GraphChart,
    GraphicComponent,
    HeatmapChart,
    LineChart,
    PieChart,
    PictorialBarChart,
    RadarChart,
    RadarComponent,
    SankeyChart,
    ScatterChart,
    SunburstChart,
    TreemapChart,
    VisualMapComponent,
  ])
}
