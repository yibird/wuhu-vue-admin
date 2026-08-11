import { unocssPlugin } from './unocss.ts'
import { fontsPlugin } from './fonts.ts'
import { componentsPlugin } from './components.ts'
import { jsxPlugin } from './jsx.ts'
import { vuePlugin } from './vue.ts'
import { autoImportPlugin } from './auto-import.ts'
import { mockPlugin } from './mock.ts'
import { visualizerPlugin } from './visualizer.ts'
import { compressionPlugin } from './compression.ts'
import { cdnImportPlugin } from './cdn.ts'
import { imageOptimizerPlugin } from './image-optimizer.ts'
import { performanceGuardPlugin } from './performanceGuard.ts'
import type { PluginOption } from 'vite'

interface CreatePluginOptions {
  command: 'build' | 'serve'
  env: Record<string, string>
}

export function createPlugin({ command, env }: CreatePluginOptions) {
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
    jsxPlugin(),
    componentsPlugin({ generateDts: isBuild }),
    autoImportPlugin(),
    fontsPlugin(),
    unocssPlugin(),
    performanceGuardPlugin({
      strict: performanceGuardStrict,
    }),
  ]

  if (isDev) {
    plugins.push(mockPlugin())
  }

  if (enableAnalyze) {
    plugins.push(visualizerPlugin({ raw: enableAnalyzeRaw }))
  }

  if (isBuild) {
    plugins.push(compressionPlugin())
  }

  if (enableImageOptimizer) {
    plugins.push(imageOptimizerPlugin())
  }

  if (enableCdn) {
    plugins.push(cdnImportPlugin())
  }

  return plugins
}
