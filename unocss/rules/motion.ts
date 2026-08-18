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

const durationPattern = motionDurationKeys.join('|')
const easePattern = motionEaseKeys.join('|')

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
]
