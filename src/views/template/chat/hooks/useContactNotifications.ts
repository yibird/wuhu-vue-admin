import { computed, shallowRef } from 'vue'
import { createInitialContactNotifications } from '../data'
import type {
  ContactNotification,
  ContactNotificationCategory,
  DirectoryGroupItem,
  DirectoryUserItem,
} from '../components/types'

interface UseContactNotificationsOptions {
  onAcceptGroup: (group: DirectoryGroupItem) => void
  onAcceptUser: (user: DirectoryUserItem) => void
  onIgnored?: () => void
}

/** 管理联系人通知的已读和处理状态，页面只负责展示与反馈。 */
export function useContactNotifications(
  options: UseContactNotificationsOptions
) {
  const notifications = shallowRef<ContactNotification[]>(
    createInitialContactNotifications()
  )
  const unreadCount = computed(
    () => notifications.value.filter((item) => item.unread).length
  )

  function markCategoryRead(category: ContactNotificationCategory) {
    if (
      !notifications.value.some(
        (item) => item.category === category && item.unread
      )
    ) {
      return
    }

    notifications.value = notifications.value.map((item) =>
      item.category === category ? { ...item, unread: false } : item
    )
  }

  function resolve(notification: ContactNotification, accepted: boolean) {
    notifications.value = notifications.value.map((item) =>
      item.id === notification.id
        ? {
            ...item,
            unread: false,
            status: accepted ? 'accepted' : 'rejected',
          }
        : item
    )

    if (!accepted) {
      options.onIgnored?.()
      return
    }
    if (notification.target?.type === 'user') {
      options.onAcceptUser(notification.target)
      return
    }
    if (notification.target?.type === 'group') {
      options.onAcceptGroup(notification.target)
    }
  }

  return {
    notifications,
    unreadCount,
    markCategoryRead,
    resolve,
  }
}
