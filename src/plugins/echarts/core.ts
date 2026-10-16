import { type SetOptionOpts, use } from 'echarts/core'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { INIT_OPTIONS_KEY, UPDATE_OPTIONS_KEY } from 'vue-echarts'
import type { App } from 'vue'

const eChartsUpdateOptions = {
  notMerge: true,
} satisfies SetOptionOpts

const coreFeatures = [
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  TooltipComponent,
]

export function provideEChartsOptions(app: App) {
  app.provide(INIT_OPTIONS_KEY, { renderer: 'canvas' })
  app.provide(UPDATE_OPTIONS_KEY, eChartsUpdateOptions)
}

export function registerEChartsCore() {
  use(coreFeatures)
}
