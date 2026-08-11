import type { App } from 'vue'

export const plugins = {
  install(_app: App) {},
}

export { applyAppLoadingTheme, hideAppLoading } from './loading'
