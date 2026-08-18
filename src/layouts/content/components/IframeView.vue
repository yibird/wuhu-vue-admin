<script lang="ts" setup>
import { computed, onUnmounted, shallowRef, watch } from 'vue'
import { Loading } from '@/components/loading'
import { useAppStore } from '@/store'

const props = withDefaults(
  defineProps<{
    src?: string
    timeout?: number
  }>(),
  {
    timeout: 15_000,
  }
)

const loading = shallowRef(true)
const error = shallowRef(false)

let timeoutId: ReturnType<typeof setTimeout> | undefined

const { animation } = useAppStore()

const loadingAnimation = computed(() => animation.value.loadingAnimation)

function clearTimeoutId() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }
}

function resetLoading() {
  clearTimeoutId()

  loading.value = true
  error.value = false

  timeoutId = setTimeout(() => {
    if (!loading.value) return

    loading.value = false
    error.value = true
  }, props.timeout)
}

function handleLoad() {
  clearTimeoutId()

  loading.value = false
  error.value = false
}

function handleError() {
  clearTimeoutId()

  loading.value = false
  error.value = true
}

watch(
  () => props.src,
  (src) => {
    if (!src) {
      clearTimeoutId()
      loading.value = false
      error.value = false
      return
    }

    resetLoading()
  },
  { immediate: true }
)

onUnmounted(clearTimeoutId)
</script>

<template>
  <div class="relative size-full min-h-full">
    <div
      v-if="loading"
      class="absolute inset-0 z-1 flex items-center justify-center bg-white"
    >
      <Loading :animation="loadingAnimation" />
    </div>

    <div
      v-else-if="error"
      class="absolute inset-0 z-1 flex items-center justify-center bg-white"
    >
      <span class="text-muted"> 页面无法加载，可能拒绝 iframe 嵌入 </span>
    </div>

    <iframe
      v-if="src"
      :src="src"
      class="size-full min-h-full border-none"
      :class="{ invisible: loading || error }"
      loading="lazy"
      allowfullscreen
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>
