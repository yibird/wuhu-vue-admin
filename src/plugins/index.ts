import type { App } from 'vue'
import { registerECharts } from './echarts'

export const plugins = {
  install(_app: App) {},
}

export { applyAppLoadingTheme, hideAppLoading } from './loading'

export function setPlugins(app: App) {
  registerECharts(app)
}
