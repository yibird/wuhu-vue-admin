import { contentVisibilityRule } from './content-visibility'
import { colorRules } from './color'

export const rules = [...colorRules, contentVisibilityRule]
