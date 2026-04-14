<template>
  <div class="full overflow-hidden">
    <n-scrollbar>
      <div class="full p-10 flex flex-col gap-10 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold">工作台</span>
          <button @click="enabled = !enabled">
            <Icon
              name="i-lucide:grid-3x3"
              :class="{ 'text-theme': enabled }"
              :size="24"
            />
          </button>
        </div>
        <Overview />
        <div ref="container" class="[&_[data-swapy-highlighted]]:bg-[#e2e2e2]">
          <n-grid x-gap="10" y-gap="10">
            <n-grid-item :span="16" class="flex flex-col gap-10">
              <Project />
              <Dynamic />
            </n-grid-item>
            <n-grid-item :span="8" class="flex flex-col gap-10">
              <Action />
              <Team />
              <DataAnalysis />
            </n-grid-item>
          </n-grid>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { createSwapy, type Swapy } from 'swapy'
import {
  Overview,
  Project,
  Action,
  Dynamic,
  Team,
  DataAnalysis,
} from './components'

const swapy = ref<Swapy>()
const container = ref<HTMLDivElement>()
const enabled = ref(false)

await new Promise((resolve) => setTimeout(resolve, 2000))

onMounted(() => {
  const el = container.value
  if (el) {
    swapy.value = createSwapy(el, { enabled: false })
    swapy.value.onSwap((event) => {
      console.log('swap', event)
    })
  }
})

onBeforeUnmount(() => {
  swapy.value?.destroy()
})

watch(enabled, (val) => {
  swapy.value?.enable(val)
})
</script>
