import { unocssPlugin } from './unocss.ts'
import { fontsPlugin } from './fonts.ts'
import { componentsPlugin } from './components.ts'
import { vuePlugin } from './vue.ts'
import { autoImportPlugin } from './auto-import.ts'
import type { PluginOption } from 'vite'

interface CreatePluginOptions {
  command: 'build' | 'serve'
}

async function getDevPlugins(command: string) {
  const isDev = command === 'serve'
  if (!isDev) return []
  const { mockPlugin } = await import('./mock.ts')
  return [mockPlugin()]
}

async function getProdPlugins(command: string): Promise<PluginOption[]> {
  if (command !== 'build') return []
  const [
    { visualizerPlugin },
    { compressionPlugin },
    { imageOptimizerPlugin },
  ] = await Promise.all([
    import('./visualizer.ts'),
    import('./compression.ts'),
    import('./image-optimizer.ts'),
  ])

  return [
    visualizerPlugin({ raw: true }),
    compressionPlugin(),
    imageOptimizerPlugin(),
  ]
}

export async function createPlugin({ command }: CreatePluginOptions) {
  const isDev = command === 'serve'
  const plugins: PluginOption[] = [
    vuePlugin(),
    componentsPlugin({ isDev }),
    autoImportPlugin({ isDev }),
    fontsPlugin(),
    unocssPlugin(),
  ]
  const devPlugins = await getDevPlugins(command)
  const prodPlugins = await getProdPlugins(command)
  return [...plugins, ...devPlugins, ...prodPlugins]
}
