import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import { resolve } from 'node:path'
import { createOptimizeDeps } from './build/optimizeDeps.ts'
import { createPlugin } from './build/plugins/index.ts'
import { createResolve } from './build/resolve.ts'
import { createServer } from './build/server.ts'

export default defineConfig(async ({ command, mode }: ConfigEnv) => {
  const envDir = resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envDir, '')
  const build =
    command === 'build'
      ? (await import('./build/build.ts')).createBuild()
      : undefined

  return {
    envDir,
    resolve: createResolve(),
    server: createServer(env),
    plugins: await createPlugin({ command, env }),
    optimizeDeps: createOptimizeDeps(),
    build,
    devtools: { enabled: false },
    // experimental: {
    //   bundledDev: true,
    // },
  }
})
