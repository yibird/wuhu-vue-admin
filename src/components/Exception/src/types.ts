import type { VNode } from 'vue'

export interface ExceptionProps {
  image?: string
  imageAlt?: string
  title?: string
  description?: string
  buttonText?: string
  showBtn?: boolean
}

export interface ExceptionEmits {
  click: []
}

export interface ExceptionSlots {
  title?: () => VNode[]
  description?: () => VNode[]
}
