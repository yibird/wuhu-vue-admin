import { unocssPlugin } from './unocss.ts'
import { fontsPlugin } from './fonts.ts'
import { componentsPlugin } from './components.ts'
import { vuePlugin } from './vue.ts'
import { autoImportPlugin } from './auto-import.ts'
import { pwaPlugin } from './pwa.ts'
import { loadingPlugin } from './loading.ts'
import type { PluginOption } from 'vite'

interface CreatePluginOptions {
  command: 'build' | 'serve'
  env: Record<string, string>
}

async function getDevPlugins({ command }: CreatePluginOptions) {
  const isDev = command === 'serve'
  if (!isDev) return []
  const { mockPlugin } = await import('./mock.ts')
  return [mockPlugin()]
}

async function getProdPlugins({
  command,
  env,
}: CreatePluginOptions): Promise<PluginOption[]> {
  if (command !== 'build') return []
  const [{ compressionPlugin }, { imageOptimizerPlugin }] = await Promise.all([
    import('./compression.ts'),
    import('./image-optimizer.ts'),
  ])
  const plugins: PluginOption[] = [compressionPlugin(), imageOptimizerPlugin()]

  if (env.VITE_ANALYZE === 'true') {
    const { visualizerPlugin } = await import('./visualizer.ts')
    plugins.unshift(visualizerPlugin({ raw: true }))
  }

  return plugins
}

export async function createPlugin(options: CreatePluginOptions) {
  const isDev = options.command === 'serve'
  const plugins: PluginOption[] = [
    vuePlugin(),
    componentsPlugin(),
    autoImportPlugin({ isDev }),
    fontsPlugin(),
    unocssPlugin(),
    pwaPlugin(),
    loadingPlugin(),
  ]
  const devPlugins = await getDevPlugins(options)
  const prodPlugins = await getProdPlugins(options)
  return [...plugins, ...devPlugins, ...prodPlugins]
}
