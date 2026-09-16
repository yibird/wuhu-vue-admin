import { createGlobalState } from '@vueuse/core'

const PIN_HASH_KEY = 'wuhu-lock-pin-hash'
const MAX_UNLOCK_ATTEMPTS = 5
const PIN_PATTERN = /^\d{4,8}$/

async function hashPin(pin: string): Promise<string> {
  const salted = `wuhu-lock:${pin}`
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(salted)
    )
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, '0')
    ).join('')
  }
  let hash = 0x811c9dc5
  for (let i = 0; i < salted.length; i++) {
    hash ^= salted.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return `fnv1a-${hash.toString(16)}`
}

function readStoredHash(): string | null {
  try {
    return window.sessionStorage.getItem(PIN_HASH_KEY)
  } catch {
    return null
  }
}

export const useLockScreen = createGlobalState(() => {
  const pinHash = shallowRef<string | null>(readStoredHash())
  const isLocked = shallowRef(Boolean(pinHash.value))
  const isSetting = shallowRef(false)
  const failedAttempts = shallowRef(0)

  function clearPin() {
    pinHash.value = null
    failedAttempts.value = 0
    try {
      window.sessionStorage.removeItem(PIN_HASH_KEY)
    } catch {
      // sessionStorage 不可用时仅保持内存状态
    }
  }

  const lock = () => {
    isSetting.value = !pinHash.value
    isLocked.value = true
    failedAttempts.value = 0
  }

  async function confirmPin(pin: string): Promise<boolean> {
    if (!PIN_PATTERN.test(pin)) return false
    pinHash.value = await hashPin(pin)
    try {
      window.sessionStorage.setItem(PIN_HASH_KEY, pinHash.value)
    } catch {
      // 存储不可用时退回内存态,刷新后解锁状态会丢失
    }
    isSetting.value = false
    return true
  }

  function cancelSetting() {
    isSetting.value = false
    if (!pinHash.value) {
      isLocked.value = false
    }
  }

  async function unlock(
    pin: string
  ): Promise<'unlocked' | 'failed' | 'exceeded'> {
    if (!pinHash.value) {
      clearPin()
      isLocked.value = false
      return 'unlocked'
    }
    const candidate = await hashPin(pin)
    if (candidate === pinHash.value) {
      clearPin()
      isLocked.value = false
      return 'unlocked'
    }
    failedAttempts.value += 1
    return failedAttempts.value >= MAX_UNLOCK_ATTEMPTS ? 'exceeded' : 'failed'
  }

  return {
    isLocked,
    isSetting,
    failedAttempts,
    maxAttempts: MAX_UNLOCK_ATTEMPTS,
    lock,
    confirmPin,
    cancelSetting,
    unlock,
    clearPin,
  }
})
