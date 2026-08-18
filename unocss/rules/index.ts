import { textRule } from './text'
import { colorRule } from './color'
import { bgRule } from './background'
import { borderRule } from './border'
import { borderColorRule } from './borderColor'
import { motionRule } from './motion'
import { shadowRule } from './shadow'

export const rules = [
  ...textRule,
  ...colorRule,
  ...bgRule,
  borderRule,
  ...borderColorRule,
  ...motionRule,
  shadowRule,
]
