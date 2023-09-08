import { createPinia } from 'pinia';
import type { App } from 'vue';
export { useAppStore } from './module/app';
export { useUserStore } from './module/user';
export { usePermissionStore } from './module/permission';
export { useMultipleTabStore } from './module/multipleTab';

const pinia = createPinia();
export function setupStore(app: App<Element>) {
  app.use(pinia);
}
