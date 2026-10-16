import { unocssPlugin } from './unocss.ts'
import { fontsPlugin } from './fonts.ts'
import { componentsPlugin } from './components.ts'
import { vuePlugin } from './vue.ts'
import { autoImportPlugin } from './auto-import.ts'
import { pwaPlugin } from './pwa.ts'
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
  const [{ compressionPlugin }, { imageOptimizerPlugin }] = await Promise.all([
    import('./compression.ts'),
    import('./image-optimizer.ts'),
  ])
  const plugins: PluginOption[] = [compressionPlugin(), imageOptimizerPlugin()]

  // 产物分析只在 `pnpm analyze` 时生成 stats.json(供 bundle:check 读取),
  // 常规构建不再为此额外花一分钟
  if (process.env.VITE_ANALYZE === 'true') {
    const { visualizerPlugin } = await import('./visualizer.ts')
    plugins.unshift(visualizerPlugin({ raw: true }))
  }

  return plugins
}

export async function createPlugin({ command }: CreatePluginOptions) {
  const isDev = command === 'serve'
  const plugins: PluginOption[] = [
    vuePlugin(),
    componentsPlugin(),
    autoImportPlugin({ isDev }),
    fontsPlugin(),
    unocssPlugin(),
    pwaPlugin(),
  ]
  const devPlugins = await getDevPlugins(command)
  const prodPlugins = await getProdPlugins(command)
  return [...plugins, ...devPlugins, ...prodPlugins]
}
