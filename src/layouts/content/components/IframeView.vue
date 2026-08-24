<script lang="ts" setup>
import { useAppStore } from '@/store'
import { Loading } from '@/components'

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
const safeSrc = computed(() => props.src)
const blocked = computed(() => Boolean(props.src) && !safeSrc.value)

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
  safeSrc,
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
      class="absolute inset-0 z-1 flex items-center justify-center bg-container"
    >
      <Loading :animation="loadingAnimation" />
    </div>

    <div
      v-else-if="error || blocked"
      class="absolute inset-0 z-1 flex items-center justify-center bg-container"
    >
      <span class="text-muted">
        {{
          blocked
            ? '页面地址未通过安全校验'
            : '页面无法加载，可能拒绝 iframe 嵌入'
        }}
      </span>
    </div>

    <iframe
      v-if="safeSrc"
      :src="safeSrc"
      class="size-full min-h-full border-none"
      :class="{ invisible: loading || error }"
      loading="lazy"
      referrerpolicy="no-referrer"
      sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts"
      allowfullscreen
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>
