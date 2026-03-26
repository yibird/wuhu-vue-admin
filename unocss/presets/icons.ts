import { presetIcons } from 'unocss'

export const iconsPreset = presetIcons({
  collections: {
    lucide: () =>
      import('@iconify-json/lucide/icons.json').then((i) => i.default),
  },
  extraProperties: {
    display: 'inline-block',
    'vertical-align': 'middle',
  },
})
