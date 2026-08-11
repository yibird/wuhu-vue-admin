import { use, type SetOptionOpts } from 'echarts/core'
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
  GridComponent,
  GraphicComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { INIT_OPTIONS_KEY, UPDATE_OPTIONS_KEY } from 'vue-echarts'
import { provide } from 'vue'

let registered = false

const eChartsUpdateOptions = {
  notMerge: true,
} satisfies SetOptionOpts

export function useECharts() {
  provide(INIT_OPTIONS_KEY, { renderer: 'canvas' })
  provide(UPDATE_OPTIONS_KEY, eChartsUpdateOptions)

  if (registered) return

  use([
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
    CanvasRenderer,
  ])
  registered = true
}
