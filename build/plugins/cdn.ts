import transformExternalCDN, { autoComplete } from 'vite-plugin-external-cdn'

export function cdnImportPlugin() {
  return transformExternalCDN({
    modules: [
      autoComplete('vue'),
      autoComplete('vue-router'),
      autoComplete('pinia'),
      autoComplete('dayjs'),
      autoComplete('@vueuse/core'),
    ],
  })
}
