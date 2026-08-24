import type { LoginRequest } from '@/apis'

export type Placement = 'left' | 'center' | 'right'

export interface LoginFormProps {
  loading?: boolean
}

export interface LoginEmits {
  submit: [credentials: LoginRequest]
}
