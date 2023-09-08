import { App } from 'vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

export function setupPlugins(app: App<Element>) {
  app.use(autoAnimatePlugin);
}
