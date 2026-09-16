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
    @reset="emit('reset')"
  />
</template>

<script setup lang="ts">
import type { ErrorBoundaryErrorPayload } from '../../../components/error-boundary'
import { ClientError } from '../../../components/exception'
import { Icon } from '../../../components/icon'
import { isNetworkDisconnectedError } from './NetworkDisconnectedError'

const props = withDefaults(
  defineProps<{
    error: ErrorBoundaryErrorPayload | null
    showDetails?: boolean
  }>(),
  {
    showDetails: import.meta.env.DEV,
  }
)

const emit = defineEmits<{
  reset: []
}>()

const networkDisconnected = computed(
  () => !!props.error && isNetworkDisconnectedError(props.error.error)
)
</script>
