import { computed } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useAuth } from '@/composables'
import { useAppStore } from '@/store'
import { useGlobalSearch, useLockScreen } from '@/layouts/config/composables'

type ShortcutAction = 'search' | 'logout' | 'lockScreen'

const isKey = (event: KeyboardEvent, key: string) =>
  event.key.toLowerCase() === key

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(
    target.closest(
      'input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"])'
    )
  )

export function useShortcuts() {
  return useShortcutKeyConfig()
}

export function useShortcutKeyConfig() {
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
  const { logout } = useAuth()

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
      logout()
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
