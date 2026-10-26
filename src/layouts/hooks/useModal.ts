import { preloadSearchModal, useGlobalSearch, useLockScreen } from '../config'
import { useGlobalShortcuts, usePreferences } from '../preferences'

export function useModal() {
  const { preferencesOpen, closePreferences } = usePreferences()
  const { searchOpen } = useGlobalSearch()
  const { lockOpen } = useLockScreen()

  onMounted(() => {
    useGlobalShortcuts()
    preloadSearchModal()
  })

  return { preferencesOpen, searchOpen, lockOpen, closePreferences }
}
