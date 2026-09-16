import type { Rule } from 'unocss'

const motionDurationKeys = [
  'none',
  'fast',
  'base',
  'moderate',
  'slow',
  'slower',
]
const motionEaseKeys = [
  'linear',
  'standard',
  'enter',
  'exit',
  'emphasized',
  'spring',
]
const motionScaleKeys = ['pressed', 'enter', 'pop', 'emphasized']

const durationPattern = motionDurationKeys.join('|')
const easePattern = motionEaseKeys.join('|')
const scalePattern = motionScaleKeys.join('|')

export const motionRule: Rule[] = [
  [
    new RegExp(`^duration-motion-(${durationPattern})$`),
    ([, key]) => ({
      'transition-duration': `var(--w-motion-duration-${key})`,
    }),
  ],
  [
    new RegExp(`^ease-motion-(${easePattern})$`),
    ([, key]) => ({
      'transition-timing-function': `var(--w-motion-ease-${key})`,
    }),
  ],
  [
    new RegExp(`^scale-motion-(${scalePattern})$`),
    ([, key]) => ({ scale: `var(--w-motion-scale-${key})` }),
  ],
]
