import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

export interface UseLoadingOptions {
  delay?: number
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { delay = 360 } = options
  const loading = shallowRef(true)
  let timer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    timer = setTimeout(() => {
      loading.value = false
    }, delay)
  })

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer)
    }
  })

  return {
    loading,
  }
}
