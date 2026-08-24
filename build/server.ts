import type { ServerOptions } from 'vite'

const ENV = {
  PORT: 5234,
  API_PROXY_URL: 'http://localhost:8080',
}

export function createServer(env: Record<string, string> = {}) {
  const proxyTarget = env.VITE_API_PROXY_URL ?? ENV.API_PROXY_URL
  const port = Number(env.VITE_PORT ?? ENV.PORT)

  return {
    cors: true,
    port,
    proxy: {
      '^/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  } as ServerOptions
}
