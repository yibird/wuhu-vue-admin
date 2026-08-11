import { presetAttributify } from 'unocss'
import { presetAntdTailwind4 } from '@antdv-next/unocss'
import { wind4Preset } from './wind4'
import { iconsPreset } from './icons'
import { extraPreset } from './extra'

export const presets = [
  wind4Preset,
  presetAttributify(),
  iconsPreset,
  extraPreset,
  presetAntdTailwind4({
    allowUnprefixed: false,
  }),
]
