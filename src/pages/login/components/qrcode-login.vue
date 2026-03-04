<template>
  <n-spin size="large" :show="loading" style="--n-opacity-spinning: 0.1">
    <div class="flex flex-col items-center gap-30">
      <n-qr-code :value="text" :size="200" />
      <div
        class="flex items-center gap-10 text-base cursor-pointer text-theme"
        @click="onRefresh"
      >
        <Icon name="i-lucide:refresh-cw" :size="18" />
        <span>{{ $t('login.refreshQrcode') }}</span>
      </div>
    </div>
  </n-spin>
</template>
<script setup lang="ts">
import type { LoginEmits } from './types'

const emits = defineEmits<LoginEmits>()
const text = ref('xxx')
const loading = ref(false)

const onRefresh = () => {
  loading.value = true
  text.value = Math.random() + ''
  setTimeout(() => {
    loading.value = false
  }, 500)
}
</script>
