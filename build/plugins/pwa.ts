import { VitePWA } from 'vite-plugin-pwa'

export function pwaPlugin() {
  return VitePWA({
    registerType: 'autoUpdate',
    // 大体积路由 chunk（jit-viewer / univer）也纳入预缓存，保证离线可用
    showMaximumFileSizeToCacheInBytesWarning: true,
    manifest: {
      name: 'Wuhu Vue Admin',
      short_name: 'Wuhu Admin',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/logo.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 16 * 1024 * 1024,
      globIgnores: ['**/*.map'],
    },
  })
}
