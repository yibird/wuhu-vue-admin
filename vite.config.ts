import { defineConfig } from 'vite'
import { createResolve, createServer, createPlugin } from './build'

export default defineConfig({
  resolve: createResolve(),
  server: createServer(),
  plugins: [createPlugin()],
  envDir: 'env',
  optimizeDeps: {
    include: [
      'vue',
      'vue-i18n',
      'naive-ui',
      'vue-router',
      'pinia',
      '@visactor/vchart',
    ],
  },
  devtools: {
    enabled: false,
  },
})
