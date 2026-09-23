export type {
  FilePreviewKind,
  FilePreviewLocale,
  FilePreviewProps,
  FilePreviewSource,
} from './src/types'

export const FilePreview = defineAsyncComponent(() => import('./src/index.vue'))
