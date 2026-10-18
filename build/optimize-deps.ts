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
      // 源码中直接引用的子路径:未预构建时会在首次进入页面时触发依赖发现,
      // Vite 重新打包后会整页 reload,表现为首次打开路由 loading 很久
      'antdv-next/dist/date-picker/index',
      'antdv-next/dist/message/index',
      'antdv-next/dist/modal/index',
      // 流程设计器首次打开时的按需依赖
      '@vue-flow/background',
      '@vue-flow/core',
      '@vue-flow/minimap',
      // 报表设计器懒加载的 Univer 表格 SDK 及其 React/rxjs 运行时
      '@univerjs/presets',
      '@univerjs/preset-sheets-core',
      'react',
      'react-dom',
      'react-dom/client',
      'rxjs',
    ],
  }
}
