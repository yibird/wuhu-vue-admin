import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export function imageOptimizerPlugin() {
  return ViteImageOptimizer({
    png: {
      quality: 80,
    },
    jpeg: {
      quality: 80,
    },
    jpg: {
      quality: 80,
    },
    svg: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    },
    cache: true,
    cacheLocation: 'node_modules/.cache/vite-plugin-image-optimizer',
  })
}
