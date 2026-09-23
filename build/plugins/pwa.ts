import { VitePWA } from 'vite-plugin-pwa'

export function pwaPlugin() {
  return VitePWA({
    registerType: 'autoUpdate',
    // 超限的大 chunk（如 jit-viewer）只告警不中断构建，运行时按需请求
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
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      globIgnores: ['**/*.map'],
    },
  })
}
