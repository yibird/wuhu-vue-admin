import type { Contact, UserInfo } from './components/types'

export function statusText(
  status?: Contact['status'] | UserInfo['status']
): string {
  switch (status) {
    case 'online':
      return '在线'
    case 'offline':
      return '离线'
    case 'busy':
      return '忙碌'
    case 'away':
      return '离开'
    default:
      return ''
  }
}
