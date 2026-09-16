import { VitePWA } from 'vite-plugin-pwa'

export function pwaPlugin() {
  return VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Wuhu Vue Admin',
      short_name: 'Wuhu Admin',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  })
}
