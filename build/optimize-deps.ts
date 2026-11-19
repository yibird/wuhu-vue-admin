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
      '@vueuse/core',
      'dayjs',
      'echarts',
      'vue-echarts',
      '@vue-flow/core',
      '@vue-flow/background',
      '@vue-flow/controls',
      '@vue-flow/minimap',
      '@univerjs/presets',
      '@univerjs/preset-sheets-core',
    ],
  }
}
