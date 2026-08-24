import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import { resolve } from 'node:path'
import {
  createPlugin,
  createResolve,
  createServer,
  createOptimizeDeps,
  createBuild,
  createCss,
} from './build/index.ts'

export default defineConfig(async ({ command, mode }: ConfigEnv) => {
  const envDir = resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envDir, '')
  const build = command === 'build' ? createBuild() : undefined
  const plugins = await createPlugin({ command })

  return {
    envDir,
    resolve: createResolve(),
    server: createServer(env),
    plugins,
    optimizeDeps: createOptimizeDeps(),
    build,
    devtools: { enabled: false },
    experimental: {
      // bundledDev: true,
    },
    css: createCss(),
  } satisfies UserConfig
})
