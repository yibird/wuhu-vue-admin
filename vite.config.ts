import { defineConfig } from 'vite'
import { createResolve, createServer, createPlugin } from './build'

export default defineConfig({
  resolve: createResolve(),
  server: createServer(),
  plugins: [createPlugin()],
  envDir: 'env'
})
