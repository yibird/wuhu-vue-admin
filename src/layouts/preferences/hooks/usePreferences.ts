import { createGlobalState } from '@vueuse/core'
import { shallowRef } from 'vue'

export const usePreferences = createGlobalState(() => {
  const preferencesOpen = shallowRef(false)

  function openPreferences() {
    preferencesOpen.value = true
  }

  function closePreferences() {
    preferencesOpen.value = false
  }

  return {
    preferencesOpen,
    openPreferences,
    closePreferences,
  }
})
