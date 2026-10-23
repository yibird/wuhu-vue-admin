import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import { resolve } from 'node:path'
import {
  createPlugin,
  createResolve,
  createServer,
  createOptimizeDeps,
  createBuild,
  createCss,
  lint,
  fmt,
} from './build/index.ts'

export default defineConfig(async ({ command, mode }: ConfigEnv) => {
  const envDir = resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envDir, '')
  const plugins = await createPlugin({ command, env })

  return {
    envDir,
    resolve: createResolve(),
    server: createServer(env),
    plugins,
    optimizeDeps: createOptimizeDeps(),
    build: createBuild(command),
    devtools: { enabled: false },
    experimental: {
      // bundledDev: true,
    },
    css: createCss(),
    lint,
    fmt,
  }
})
