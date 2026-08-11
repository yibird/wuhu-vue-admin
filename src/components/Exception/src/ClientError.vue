<script setup lang="ts">
import { computed } from 'vue'
import Exception from './Exception.vue'
import clientErrorSvg from '@/assets/svg/500.svg'
import type { ErrorBoundaryErrorPayload } from '@/components/errorBoundary'

interface ClientErrorProps {
  readonly error: ErrorBoundaryErrorPayload | null
  readonly showDetails?: boolean
}

interface ClientErrorEmits {
  reset: []
}

const props = withDefaults(defineProps<ClientErrorProps>(), {
  showDetails: false,
})
const emit = defineEmits<ClientErrorEmits>()

const title = '抱歉，页面组件发生了客户端错误'
const defaultMessage = '页面渲染时捕获到异常，请稍后重试或联系管理员。'

const errorMessage = computed(() => props.error?.message || defaultMessage)
const stack = computed(() => props.error?.stack)
const detailRows = computed(() => [
  { label: '错误信息', value: errorMessage.value },
  { label: '组件', value: props.error?.componentName ?? '未知组件' },
  { label: '阶段', value: props.error?.info ?? '未知阶段' },
  { label: '时间', value: props.error?.timestamp ?? '-' },
])

const handleReset = () => {
  emit('reset')
}
</script>

<template>
  <Exception :image="clientErrorSvg" :show-btn="false" :title="title">
    <template #description>
      <div class="mt-12 max-w-760 text-left">
        <p class="m-0 text-sm text-secondary">
          {{ defaultMessage }}
        </p>
        <details
          v-if="props.showDetails"
          class="mt-14 rounded-8 border border-color-2 bg-fill-1 p-16 text-left dark:bg-fill-2"
        >
          <summary class="cursor-pointer text-sm text-main font-500">
            查看错误详情
          </summary>
          <div class="mt-12 grid gap-8">
            <div
              v-for="item in detailRows"
              :key="item.label"
              class="flex gap-12 text-sm leading-6"
            >
              <span class="w-72 shrink-0 text-muted">{{ item.label }}</span>
              <span class="min-w-0 flex-1 break-all text-main">
                {{ item.value }}
              </span>
            </div>
            <pre
              v-if="stack"
              class="m-0 max-h-220 overflow-auto whitespace-pre-wrap break-words rounded-6 bg-fill-3 p-12 text-xs leading-5 text-secondary"
              >{{ stack }}</pre>
          </div>
        </details>
        <div class="mt-16 flex items-center gap-12">
          <a-button type="primary" @click="handleReset">刷新页面</a-button>
        </div>
      </div>
    </template>
  </Exception>
</template>
