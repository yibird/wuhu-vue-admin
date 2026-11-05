import type { DepOptimizationConfig } from 'vite'

export function createOptimizeDeps(): DepOptimizationConfig {
  return {
    // 避免 boneyard 的两个入口被分别预构建,导致 bones 注册表不是同一个实例
    exclude: ['boneyard-js', 'boneyard-js/vue'],
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
