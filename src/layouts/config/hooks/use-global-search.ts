import { shallowRef } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useGlobalSearch = createGlobalState(() => {
  const searchOpen = shallowRef(false)
  const openSearch = () => {
    searchOpen.value = true
  }
  const closeSearch = () => {
    searchOpen.value = false
  }
  const toggleSearch = () => {
    searchOpen.value = !searchOpen.value
  }

  return {
    searchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  }
})
