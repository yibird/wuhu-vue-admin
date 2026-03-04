import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export * from './app'
export * from './app/types'

export * from './tabs'
export type * from './tabs/types'

export * from './permission'
export type * from './permission/types'
