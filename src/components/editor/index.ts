export const Editor = defineAsyncComponent(() => import('./src/index.vue'))
export type {
  EditorLocale,
  EditorExpose,
  EditorProps,
  EditorSelectOption,
} from './src/types'
