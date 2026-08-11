import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'

interface VisualizerPluginOptions {
  raw?: boolean
}

export function visualizerPlugin(options: VisualizerPluginOptions = {}) {
  const { raw = false } = options

  return visualizer({
    open: false,
    filename: raw ? 'stats.json' : 'stats.html',
    template: raw ? 'raw-data' : 'treemap',
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption
}
