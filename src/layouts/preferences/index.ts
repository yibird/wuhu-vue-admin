export const Preferences = defineAsyncComponent(
  () => import('./preferences.vue')
)

export const FloatingBar = defineAsyncComponent(
  () => import('./floating-bar.vue')
)

export {
  usePreferences,
  useConfig,
  useShortcutConfig,
  useGlobalShortcuts,
} from './hooks'
