import type { Conversation } from '../types'

export type CallStatus = 'calling' | 'connected' | 'error'

export interface CallWindowProps {
  conversation?: Conversation
  open: boolean
}

export interface CallWindowEmits {
  'update:open': [value: boolean]
}
