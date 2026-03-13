import { vueDevToolsPlugin } from './devTools'
import { unocssPlugin } from './unocss'
import { componentsPlugin } from './components'
import { jsxPlugin } from './jsx'
import { vuePlugin } from './vue'
import { autoImportPlugin } from './auto-import'
import { mockPlugin } from './mock'
import { inspectPlugin } from './inspect'
import { visualizerPlugin } from './visualizer'
import { compressionPlugin } from './compression'
import { lazyImportPlugin } from './lazy-import'
import { cdnImportPlugin } from './cdn'

export function createPlugin() {
  return [
    vueDevToolsPlugin(),
    componentsPlugin(),
    unocssPlugin(),
    autoImportPlugin(),
    jsxPlugin(),
    vuePlugin(),
    mockPlugin(),
    inspectPlugin(),
    visualizerPlugin(),
    compressionPlugin(),
    lazyImportPlugin(),
    cdnImportPlugin(),
  ]
}
