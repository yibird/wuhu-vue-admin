import {
  defaultIgnoreAttributes,
  presetAttributify,
} from 'unocss/preset-attributify'
import presetUnocss from '@starweave-lab/unocss-preset'
import { wind4Preset } from './wind4'
import { iconsPreset } from './icons'
import { extraPreset } from './extra'
import { fontsPreset } from './fonts'
import { borderColorTokens } from '../token'

export const presets = [
  wind4Preset,
  presetAttributify({
    ignoreAttributes: [
      ...defaultIgnoreAttributes,
      'color',
      ':color',
      'v-bind:color',
      'name',
      ':name',
      'v-bind:name',
      'icon',
      ':icon',
      'v-bind:icon',
      'avatar',
    ],
  }),
  iconsPreset,
  extraPreset,
  fontsPreset,
  presetUnocss({
    borderColors: borderColorTokens,
  }),
]
