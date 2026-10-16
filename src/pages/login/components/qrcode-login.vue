<template>
  <div class="flex flex-col items-center gap-22 py-12">
    <a-spin size="large" :spinning="refreshing || loading" :delay="120">
      <div
        class="rounded-8 border-1 border-color-2 border-solid bg-fill-quaternary p-16 shadow-all-sm transition-[border-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 border-primary/50 shadow-all-md) motion-reduce:(transform-none transition-none)"
      >
        <QRCode :value="text" :size="196" />
      </div>
    </a-spin>
    <a-button
      type="text"
      :disabled="refreshing || loading"
      class="text-regular! hover:text-primary!"
      @click="onRefresh"
    >
      <template #icon>
        <Icon
          name="i-lucide:refresh-cw"
          :size="17"
          :class="{ 'animate-spin': refreshing }"
        />
      </template>
      {{ $t('login.refreshQrcode') }}
    </a-button>
  </div>
</template>
<script setup lang="ts">
import { QRCode } from 'antdv-next'
import type { LoginFormProps } from './types'

withDefaults(defineProps<LoginFormProps>(), { loading: false })
const createQrValue = () =>
  `wuhu-admin://login/${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`

const text = shallowRef(createQrValue())
const refreshing = shallowRef(false)
let refreshTimer: ReturnType<typeof setTimeout> | null = null
onUnmounted(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
})

const onRefresh = () => {
  if (refreshing.value) return
  refreshing.value = true
  text.value = createQrValue()
  refreshTimer = setTimeout(() => {
    refreshTimer = null
    refreshing.value = false
  }, 500)
}
</script>
