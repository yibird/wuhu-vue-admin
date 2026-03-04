import type { ServerOptions } from 'vite'

const ENV = {
  PORT: 5234,
  API_PROXY_URL: 'http://localhost:8080'
}

export function createServer() {
  return {
    cors: true,
    port: ENV.PORT,
    proxy: {
      '^/api': {
        target: '',
        // secure: false,
        // ws: true
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  } as ServerOptions
}
