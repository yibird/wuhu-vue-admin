import type { ChatSettings, Message } from '../../types'

export interface EditorProps {
  placeholder?: string
  disabled?: boolean
  replyMessage?: Message | null
  editMessage?: Message | null
  settings?: ChatSettings
}
