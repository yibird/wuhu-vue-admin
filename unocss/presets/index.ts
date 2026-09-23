import {
  defaultIgnoreAttributes,
  presetAttributify,
} from 'unocss/preset-attributify'
import { wind4Preset } from './wind4'
import { iconsPreset } from './icons'
import { extraPreset } from './extra'
import { fontsPreset } from './fonts'

export const presets = [
  wind4Preset,
  presetAttributify({
    ignoreAttributes: [
      ...defaultIgnoreAttributes,
      'color',
      ':color',
      'v-bind:color',
    ],
  }),
  iconsPreset,
  extraPreset,
  fontsPreset,
]
