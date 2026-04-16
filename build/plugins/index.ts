import { unocssPlugin } from './unocss'
import { componentsPlugin } from './components'
import { jsxPlugin } from './jsx'
import { vuePlugin } from './vue'
import { autoImportPlugin } from './auto-import'
import { mockPlugin } from './mock'
import { visualizerPlugin } from './visualizer'
import { compressionPlugin } from './compression'
import { lazyImportPlugin } from './lazy-import'
import { cdnImportPlugin } from './cdn'

export function createPlugin() {
  return [
    componentsPlugin(),
    unocssPlugin(),
    autoImportPlugin(),
    jsxPlugin(),
    vuePlugin(),
    mockPlugin(),
    visualizerPlugin(),
    compressionPlugin(),
    lazyImportPlugin(),
    cdnImportPlugin(),
  ]
}
