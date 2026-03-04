<template>
  <slot v-if="hasError" name="fallback" />
  <slot v-else />
</template>
<script setup lang="ts">
import type {
  ErrorBoundaryInstance,
  ErrorBoundaryProps,
  ErrorBoundarySlots,
} from './types'

const { stopPropagation = false, onError } = defineProps<ErrorBoundaryProps>()
const slots = defineSlots<ErrorBoundarySlots>()

const hasError = ref(false)
const error = ref<Error | null>(null)

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  error.value = err
  hasError.value = true
  onError?.(err, instance, info)
  return stopPropagation
})

// 重置错误状态
const resetError = () => {
  hasError.value = false
  error.value = null
}

defineExpose<ErrorBoundaryInstance>({
  hasError,
  error,
  resetError,
})
</script>
