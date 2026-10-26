<template>
  <div class="py-30 flex flex-col items-center gap-22">
    <a-spin size="large" :spinning="refreshing || loading" :delay="120">
      <div
        class="rounded-8 b-1-[border-regular] bg-secondary p-16 shadow-sm transition-all hover:(-translate-y-1 border-primary/50 shadow-md)"
      >
        <QRCode :value="text" :size="200" />
      </div>
    </a-spin>
    <a-button type="text" :disabled="refreshing || loading" @click="onRefresh">
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
