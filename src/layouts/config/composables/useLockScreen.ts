import { createGlobalState } from '@vueuse/core'
import { shallowRef } from 'vue'

export const useLockScreen = createGlobalState(() => {
  const isLocked = shallowRef(false)

  const lock = () => {
    isLocked.value = true
  }

  const unlock = () => {
    isLocked.value = false
  }

  return {
    isLocked,
    lock,
    unlock,
  }
})
