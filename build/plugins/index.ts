import { unocssPlugin } from './unocss.ts'
import { fontsPlugin } from './fonts.ts'
import { componentsPlugin } from './components.ts'
import { vuePlugin } from './vue.ts'
import { autoImportPlugin } from './auto-import.ts'
import type { PluginOption } from 'vite'

interface CreatePluginOptions {
  command: 'build' | 'serve'
  env: Record<string, string>
}

export async function createPlugin({ command, env }: CreatePluginOptions) {
  const isBuild = command === 'build'
  const isDev = command === 'serve'
  const enableAnalyze = env.VITE_ANALYZE === 'true' || env.ANALYZE === 'true'
  const enableAnalyzeRaw = env.VITE_ANALYZE_RAW === 'true'
  const enableCdn = isBuild && env.VITE_CDN === 'true'
  const enableImageOptimizer = isBuild && env.VITE_IMAGE_OPTIMIZER === 'true'
  const performanceGuardStrict =
    env.VITE_PERFORMANCE_GUARD_STRICT === 'true' ||
    (isBuild && env.VITE_PERFORMANCE_GUARD_STRICT !== 'false')

  const plugins: PluginOption[] = [
    vuePlugin(),
    componentsPlugin({ generateDts: isDev }),
    autoImportPlugin({ generateDts: isDev }),
    fontsPlugin(),
    unocssPlugin(),
  ]

  if (isDev) {
    const { mockPlugin } = await import('./mock.ts')
    plugins.push(mockPlugin())
  }

  if (enableAnalyze) {
    const { visualizerPlugin } = await import('./visualizer.ts')
    plugins.push(visualizerPlugin({ raw: enableAnalyzeRaw }))
  }

  if (isBuild) {
    const [{ compressionPlugin }, { performanceGuardPlugin }] =
      await Promise.all([
        import('./compression.ts'),
        import('./performanceGuard.ts'),
      ])

    plugins.push(
      performanceGuardPlugin({
        strict: performanceGuardStrict,
      })
    )
    plugins.push(compressionPlugin())
  }

  if (enableImageOptimizer) {
    const { imageOptimizerPlugin } = await import('./image-optimizer.ts')
    plugins.push(imageOptimizerPlugin())
  }

  if (enableCdn) {
    const { cdnImportPlugin } = await import('./cdn.ts')
    plugins.push(cdnImportPlugin())
  }

  return plugins
}
