export const Preferences = defineAsyncComponent(
  () => import('./Preferences.vue')
)

export const FloatingBar = defineAsyncComponent(
  () => import('./FloatingBar.vue')
)

export {
  usePreferences,
  useConfig,
  useShortcuts,
  useGlobalShortcuts,
} from './hooks'
