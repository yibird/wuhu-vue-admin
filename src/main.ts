import { createApp } from 'vue';
import { setupPlugins } from './plugins';
import { setupRouter, router, setupRouterGuard } from './router';
import { setupStore } from './store';
import { setupI18n } from './locales'
import { setupRegisterGlobComponent } from './components';
import { setupDirectives } from './directives';

import './styles/index.css';
import App from './App.vue';

async function bootstrap() {
  const app = createApp(App);
  setupPlugins(app);
  setupStore(app);
  setupI18n(app)
  setupRegisterGlobComponent(app);
  setupRouterGuard(router);
  setupDirectives(app);
  await setupRouter(app);

  app.mount('#app');
}
bootstrap();


