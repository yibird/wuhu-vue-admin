<script setup lang="ts">
import { Icon, NumberTicker, Scrollbar } from '@/components'

const tickerValue = shallowRef(128560)

function updateTicker() {
  tickerValue.value = Math.round(50000 + Math.random() * 250000)
}
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">NumberTicker</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              带区域格式和低动态偏好适配的数字动画。
            </p>
          </div>
          <a-tag color="blue">src/components/number-ticker</a-tag>
        </header>

        <div class="grid gap-18">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div class="rounded-6 bg-fill-1 p-18">
              <p class="m-0 text-xs text-muted">订单金额</p>
              <NumberTicker
                :value="tickerValue"
                prefix="¥"
                class="mt-8 block text-2xl text-main font-650"
              />
            </div>
            <div class="rounded-6 bg-fill-1 p-18">
              <p class="m-0 text-xs text-muted">完成率</p>
              <NumberTicker
                :value="92.6"
                :decimals="1"
                suffix="%"
                class="mt-8 block text-2xl text-success font-650"
              />
            </div>
            <div class="rounded-6 bg-fill-1 p-18">
              <p class="m-0 text-xs text-muted">今日访问</p>
              <NumberTicker
                :value="28640"
                class="mt-8 block text-2xl text-primary font-650"
              />
            </div>
          </div>
          <a-button class="w-fit" @click="updateTicker">
            <template #icon><Icon name="i-lucide:refresh-cw" /></template>
            更新数字
          </a-button>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
