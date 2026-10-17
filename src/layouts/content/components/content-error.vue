<template>
  <div
    v-if="networkDisconnected"
    class="full flex flex-col items-center justify-center px-20 text-center"
  >
    <span
      class="size-64 flex items-center justify-center rounded-full bg-warning/10 text-warning"
    >
      <Icon name="i-lucide:wifi-off" :size="30" />
    </span>
    <h1 class="mb-0 mt-18 text-xl text-main font-600">网络连接已断开</h1>
    <p class="mb-0 mt-8 text-sm text-secondary">
      请检查网络连接，恢复后页面将自动重试。
    </p>
  </div>
  <ClientError
    v-else
    :error="error"
    :show-details="showDetails"
    @reset="emits('reset')"
  />
</template>

<script setup lang="ts">
import { ClientError } from '@/components/exception'
import { isNetworkDisconnectedError } from '@/errors'
import type { ErrorBoundaryErrorPayload } from '@/components/error-boundary'

const props = withDefaults(
  defineProps<{
    error: ErrorBoundaryErrorPayload | null
    showDetails?: boolean
  }>(),
  {
    showDetails: import.meta.env.DEV,
  }
)

const emits = defineEmits<{
  reset: []
}>()

const networkDisconnected = computed(
  () => !!props.error && isNetworkDisconnectedError(props.error.error)
)
</script>
