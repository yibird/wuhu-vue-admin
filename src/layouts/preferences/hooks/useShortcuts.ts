import { computed } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useAuth } from '@/hooks'
import { useAppStore } from '@/store'
import { useGlobalSearch, useLockScreen } from '@/layouts/config/hooks'

type ShortcutAction = 'search' | 'logout' | 'lockScreen'

// macOS 按住 Option 会生成特殊字符,event.key 不可靠,需兼容物理键码
const isKey = (event: KeyboardEvent, key: string) =>
  event.key.toLowerCase() === key || event.code.toLowerCase() === `key${key}`

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(
    target.closest(
      'input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"])'
    )
  )

export function useShortcutConfig() {
  const { shortcutKey } = useAppStore()

  const createModel = (key: keyof typeof shortcutKey.value) =>
    computed({
      get: () => shortcutKey.value[key],
      set: (value: boolean) => {
        shortcutKey.value[key] = value
      },
    })

  return {
    enabled: createModel('enabled'),
    search: createModel('search'),
    logout: createModel('logout'),
    lockScreen: createModel('lockScreen'),
  }
}

export function useGlobalShortcuts() {
  const { shortcutKey } = useAppStore()
  const { openSearch, closeSearch } = useGlobalSearch()
  const { isLocked, lock } = useLockScreen()
  const { doLogout } = useAuth()

  const canHandle = (event: KeyboardEvent, action: ShortcutAction) => {
    const config = shortcutKey.value
    return (
      !event.defaultPrevented &&
      !event.isComposing &&
      !isEditableTarget(event.target) &&
      config.enabled &&
      config[action]
    )
  }

  onKeyStroke(
    (event) =>
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      !event.shiftKey &&
      isKey(event, 'k'),
    (event) => {
      if (!canHandle(event, 'search') || isLocked.value) return

      event.preventDefault()
      openSearch()
    },
    { dedupe: true }
  )

  onKeyStroke(
    (event) =>
      event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      isKey(event, 'q'),
    (event) => {
      if (!canHandle(event, 'logout') || isLocked.value) return

      event.preventDefault()
      closeSearch()
      doLogout()
    },
    { dedupe: true }
  )

  onKeyStroke(
    (event) =>
      event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      isKey(event, 'l'),
    (event) => {
      if (!canHandle(event, 'lockScreen') || isLocked.value) return

      event.preventDefault()
      closeSearch()
      lock()
    },
    { dedupe: true }
  )
}
