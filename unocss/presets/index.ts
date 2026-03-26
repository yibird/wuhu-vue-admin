import { presetAttributify } from 'unocss'
import { wind4Preset } from './wind4'
import { fontsPreset } from './fonts'
import { iconsPreset } from './icons'
import { extraPreset } from './extra'

export const presets = [
  wind4Preset,
  presetAttributify(),
  fontsPreset,
  iconsPreset,
  extraPreset,
]
