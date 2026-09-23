import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { appStore, useAppStore } from './app'
export type { AppState } from './app/types'

export { tabsStore, useTabsStore } from './tabs'
export { registerTabGuard } from './tabs/guard'
export type { TabNavOption, TabTarget } from './tabs/types'
export type {
  TabGuard,
  TabGuardAction,
  TabGuardContext,
  TabGuardHandler,
  TabGuardSource,
} from './tabs/types'

export { permissionStore, usePermissionStore } from './permission'
export type { PermissionState } from './permission/types'

export { authStore, useAuthStore } from './auth'
export type { AuthState } from './auth/types'
