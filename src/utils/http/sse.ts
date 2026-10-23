type SessionExpiredListener = () => void

const listeners = new Set<SessionExpiredListener>()
let notified = false

export function onSessionExpired(listener: SessionExpiredListener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * 通知会话过期。
 *
 * 并发 401 / 无 token 请求只会触发一次，避免重复 logout 与路由跳转；
 * 登录成功写入新 token 时通过 resetSessionExpiredNotification 复位。
 */
export function notifySessionExpired() {
  if (notified) return
  notified = true

  listeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      console.error('[session] expired listener failed', error)
    }
  })
}

export function resetSessionExpiredNotification() {
  notified = false
}
