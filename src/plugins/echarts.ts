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
import { provideEChartsOptions, registerEChartsCore } from './echartsCore'

let registered = false

export function useECharts() {
  provideEChartsOptions()

  if (registered) return

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
  registered = true
}
