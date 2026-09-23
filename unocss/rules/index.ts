import { textSizeRule } from './text-size'
import { colorRule } from './color'
import { bgRule } from './background'
import { borderColorRule } from './border-color'
import { motionRules } from './motion'
import { shadowRules } from './shadow'
import { contentVisibilityRule } from './content-visibility'

export const rules = [
  ...motionRules,
  ...shadowRules,
  bgRule,
  textSizeRule,
  colorRule,
  borderColorRule,
  contentVisibilityRule,
]
