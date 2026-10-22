import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { appStore, useAppStore } from './app'
export { tabsStore, useTabsStore } from './tabs'
export { permissionStore, usePermissionStore } from './permission'
export { authStore, useAuthStore } from './auth'
export { dictStore, useDictStore } from './dict'
