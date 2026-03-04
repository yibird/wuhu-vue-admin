import type { IMenu } from '#/config'

export interface LogoProps {
  /**
   * @desc 收缩状态
   * @default false
   */
  collapsed?: boolean
}

export interface SearchProps {
  collapsed?: boolean
}

export interface SearchEmits {
  (e: 'change', value: string): void
  (e: 'clear'): void
}
