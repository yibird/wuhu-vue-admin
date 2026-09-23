import { useAppStore } from '@/store'
import { useGlobalSearch, useLockScreen } from '../config'
import { useGlobalShortcuts, usePreferences } from '../preferences'

export function useLayout() {
  const { header, tabs } = useAppStore()

  const { preferencesOpen, closePreferences } = usePreferences()
  const { searchOpen } = useGlobalSearch()
  const { isLocked } = useLockScreen()

  const fixedHeader = computed(() => header.value.fixed)
  const showTabs = computed(() => tabs.value.show)

  useGlobalShortcuts()

  const contentStyle = computed(() => {
    const minHeight = !fixedHeader.value
      ? '100%'
      : tabs.value
        ? 'calc(100% - 90px)'
        : 'calc(100% - 50px)'
    return {
      'min-height': minHeight,
    }
  })
  return {
    fixedHeader,
    showTabs,
    contentStyle,
    preferencesOpen,
    searchOpen,
    isLocked,
    closePreferences,
  }
}
