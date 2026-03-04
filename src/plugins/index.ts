import { vChartPlugin } from './vchart'

import type { App } from 'vue'

export function setupPlugins(app: App) {
  vChartPlugin()
}
