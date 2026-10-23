import type { App } from 'vue'
import { setupGlobalErrorHandler } from './error-handler.ts'

export const plugins = {
  install(app: App) {
    setupGlobalErrorHandler(app)
  },
}
