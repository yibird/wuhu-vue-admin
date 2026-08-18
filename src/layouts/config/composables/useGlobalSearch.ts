import { shallowRef } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const useGlobalSearch = createGlobalState(() => {
  const searchMounted = shallowRef(false)
  const searchVisible = shallowRef(false)
  const openSearch = () => {
    searchMounted.value = true
    searchVisible.value = true
  }
  const closeSearch = () => {
    searchVisible.value = false
  }
  const toggleSearch = () => {
    if (!searchVisible.value) searchMounted.value = true
    searchVisible.value = !searchVisible.value
  }

  return {
    searchMounted,
    searchVisible,
    openSearch,
    closeSearch,
    toggleSearch,
  }
})
