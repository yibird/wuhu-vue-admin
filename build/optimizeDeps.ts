export function createOptimizeDeps() {
  return {
    // The app uses import.meta.glob for every route. Automatic discovery would
    // crawl all lazy views and eagerly optimize their large, page-only packages.
    noDiscovery: true,
    include: [
      'vue',
      'vue-router',
      'pinia',
      'pinia-plugin-persistedstate',
      'vue-i18n',
      'dayjs',
      'dayjs/plugin/advancedFormat',
      'dayjs/plugin/customParseFormat',
      'dayjs/plugin/localeData',
      'dayjs/plugin/weekOfYear',
      'dayjs/plugin/weekYear',
      'dayjs/plugin/weekday',
      '@vueuse/core',
      'es-toolkit',
      'overlayscrollbars',
      'overlayscrollbars-vue',
      'ky',
      'topbar',
      'antdv-next',
      'pinyin-match',
    ],
  }
}
