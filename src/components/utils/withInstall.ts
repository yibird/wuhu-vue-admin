import type { App, Component } from 'vue'

export interface InstallComponent {
  install(app: App): void
}

export function withInstall<T extends Component>(component: T) {
  const installable = component as T & InstallComponent

  installable.install = (app: App) => {
    const name = component.name
    if (name) {
      app.component(name, component)
    }
  }

  return installable
}
