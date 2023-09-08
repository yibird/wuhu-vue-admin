import { App } from "vue";
import { createI18n } from "vue-i18n";

export function setupI18n(app: App<Element>) {
  const i18n = createI18n({});
  app.use(i18n);
}
