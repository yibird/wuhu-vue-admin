import { use } from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  DatasetComponent,
  GraphicComponent,
  RadarComponent,
  VisualMapComponent,
} from 'echarts/components'
import { provideEChartsOptions, registerEChartsCore } from './echartsCore'

let dashboardRegistered = false

export function useDashboardECharts() {
  provideEChartsOptions()

  if (dashboardRegistered) return

  registerEChartsCore()
  use([
    BarChart,
    DatasetComponent,
    GraphicComponent,
    LineChart,
    PieChart,
    RadarComponent,
    VisualMapComponent,
  ])
  dashboardRegistered = true
}
