import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import { resolve } from 'node:path'
import {
  createBuild,
  createOptimizeDeps,
  createPlugin,
  createResolve,
  createServer,
} from './build/index.ts'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const envDir = resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envDir, '')

  return {
    envDir,
    resolve: createResolve(),
    server: createServer(env),
    plugins: createPlugin({ command, env }),
    optimizeDeps: createOptimizeDeps(),
    build: createBuild(),
    devtools: { enabled: false },
    // experimental: {
    //   bundledDev: true,
    // },
  }
})
