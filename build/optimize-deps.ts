import type { DepOptimizationConfig } from 'vite'

export function createOptimizeDeps(): DepOptimizationConfig {
  return {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'pinia-plugin-persistedstate',
      'vue-i18n',
      'antdv-next',
    ],
  }
}
