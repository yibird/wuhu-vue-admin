import type { LoadingAnimationType } from '@/constants'

export interface LoadingProps {
  description?: string
  fullScreen?: boolean
  type?: LoadingAnimationType
  animation?: LoadingAnimationType
}
