import { provide } from 'vue'
import { type SetOptionOpts, use } from 'echarts/core'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { INIT_OPTIONS_KEY, UPDATE_OPTIONS_KEY } from 'vue-echarts'

let coreRegistered = false

const eChartsUpdateOptions = {
  notMerge: true,
} satisfies SetOptionOpts

const coreFeatures = [
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  TooltipComponent,
]

export function provideEChartsOptions() {
  provide(INIT_OPTIONS_KEY, { renderer: 'canvas' })
  provide(UPDATE_OPTIONS_KEY, eChartsUpdateOptions)
}

export function registerEChartsCore() {
  if (coreRegistered) return

  use(coreFeatures)
  coreRegistered = true
}
