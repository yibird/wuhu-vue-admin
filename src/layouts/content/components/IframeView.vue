<script lang="ts" setup>
import { onUnmounted } from 'vue'
import { Loading } from '@/components'
import { useAppStore } from '@/store'

const props = defineProps<{
  src?: string
}>()

const loading = shallowRef(true)
const error = shallowRef(false)
let loadTimeout: ReturnType<typeof setTimeout> | null = null

const { animation } = useAppStore()
// const {} = useTabStore();
const loadingAnimation = computed(() => animation.value.loadingAnimation)

const resetLoading = () => {
  if (loadTimeout) clearTimeout(loadTimeout)
  loading.value = true
  error.value = false
  loadTimeout = setTimeout(() => {
    if (loading.value) {
      loading.value = false
      error.value = true
    }
  }, 15000)
}

const onLoad = () => {
  if (loadTimeout) clearTimeout(loadTimeout)
  loading.value = false
  error.value = false
}

const onError = () => {
  if (loadTimeout) clearTimeout(loadTimeout)
  loading.value = false
  error.value = true
}

watch(
  () => props.src,
  () => {
    resetLoading()
  },
  { immediate: true }
)

const iframeRef = ref<HTMLIFrameElement>()

onUnmounted(() => {
  if (loadTimeout) clearTimeout(loadTimeout)
  // 清空 iframe src 释放页面资源
  if (iframeRef.value) {
    iframeRef.value.src = 'about:blank'
  }
})
</script>

<template>
  <div class="relative full min-h-full">
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
      <span class="text-muted">页面无法加载，可能拒绝 iframe 嵌入</span>
    </div>
    <iframe
      v-if="src"
      ref="iframeRef"
      :src="src"
      class="full min-h-full border-none"
      :class="{ invisible: error }"
      frameborder="0"
      allowfullscreen
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
