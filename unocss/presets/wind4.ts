import { presetWind4 } from 'unocss'
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'
import type { Preset } from 'unocss'

export const wind4Preset = presetWind4({
  preflights: {
    reset: true,
    theme: {
      mode: 'on-demand',
      process: createRemToPxProcessor(4),
    },
  },
}) as Preset
