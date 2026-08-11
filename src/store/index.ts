import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { appStore, useAppStore } from './app'
export type { AppState } from './app/types'

export { tabStore, useTabStore } from './tabs'
export type { TabState } from './tabs/types'

export {
  filterMenusByPermissions,
  hasPermission,
  permissionStore,
  resolveMenuPermission,
  usePermissionStore,
} from './permission'
export type { PermissionState } from './permission/types'

export { dictStore, useDictStore } from './dict'
export type { DictState } from './dict/types'

export { authStore, setupAuthSessionSync, useAuthStore } from './auth'
export type { AuthState } from './auth/types'
