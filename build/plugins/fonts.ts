import Unfonts from 'unplugin-fonts/vite'

export function fontsPlugin() {
  return Unfonts({
    custom: {
      display: 'swap',
      preload: true,
      prefetch: false,
      families: [
        {
          name: 'Inter Variable',
          src: './src/assets/fonts/InterVariable.woff2',
          transform(font) {
            font.weight = '100 900'
            return font
          },
        },
      ],
    },
  })
}
