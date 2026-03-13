import { importToCDN, autoComplete } from 'vite-plugin-external-cdn'

export function cdnImportPlugin() {
  return importToCDN({
    modules: [
      autoComplete('vue'),
      autoComplete('vue-router'),
      autoComplete('pinia'),
      autoComplete('dayjs'),
      autoComplete('@vueuse/core'),
    ],
  })
}
