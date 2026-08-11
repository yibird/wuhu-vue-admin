import { shallowRef } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useGlobalSearch = createGlobalState(() => {
  const searchVisible = shallowRef(false)
  const openSearch = () => {
    searchVisible.value = true
  }
  const closeSearch = () => {
    searchVisible.value = false
  }
  const toggleSearch = () => {
    searchVisible.value = !searchVisible.value
  }

  return {
    searchVisible,
    openSearch,
    closeSearch,
    toggleSearch,
  }
})
