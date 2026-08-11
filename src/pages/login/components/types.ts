import type { LoginRequest } from '@/apis'

export interface LoginFormProps {
  loading?: boolean
}

export interface LoginEmits {
  submit: [credentials: LoginRequest]
}
