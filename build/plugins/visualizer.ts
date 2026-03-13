import { visualizer } from 'rollup-plugin-visualizer'

export function visualizerPlugin() {
  return visualizer({
    open: true,
    filename: 'stats.html',
    gzipSize: true,
    brotliSize: true,
  })
}
