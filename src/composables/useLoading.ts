import { onBeforeUnmount, onMounted, readonly, shallowRef } from 'vue'

export interface UseLoadingOptions {
  delay?: number
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { delay = 360 } = options
  const isLoading = shallowRef(true)
  let timer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    timer = setTimeout(() => {
      isLoading.value = false
    }, delay)
  })

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer)
    }
  })

  return {
    isLoading: readonly(isLoading),
  }
}
