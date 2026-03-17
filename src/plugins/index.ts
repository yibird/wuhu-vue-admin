import { vChartPlugin } from './vchart'
import type { App } from 'vue'

export const plugins = {
  install(app: App) {
    vChartPlugin()
  },
}
