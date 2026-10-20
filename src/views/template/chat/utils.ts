import type { Contact, UserInfo } from './components/types'

/** 用户头像缺失时的默认头像地址 */
export const DEFAULT_AVATAR = 'https://i.pravatar.cc/100?img=1'

/** 用群名生成默认群头像地址（DiceBear initials 服务）。 */
export function createGroupAvatar(name: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`
}

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
