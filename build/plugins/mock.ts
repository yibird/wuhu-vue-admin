import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

export function mockPlugin() {
  return mockDevServerPlugin({
    prefix: '^/api-dev/',
  })
}
