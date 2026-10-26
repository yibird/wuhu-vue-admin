import { contentVisibilityRule } from './content-visibility'
import { motionRules } from './motion'
import { colorRules } from './color'

export const rules = [...motionRules, ...colorRules, contentVisibilityRule]
