<script setup lang="ts">
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'

const iconSamples = [
  'i-lucide:activity',
  'i-lucide:bell',
  'i-lucide:calendar',
  'i-lucide:chart-pie',
  'i-lucide:cloud',
  'i-lucide:database',
  'i-lucide:folder',
  'i-lucide:mail',
  'i-lucide:settings',
  'i-lucide:users',
]
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
            <h1 class="m-0 text-xl text-main font-600">Icon</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              统一尺寸、颜色与可访问语义的图标组件。
            </p>
          </div>
          <a-tag color="blue">src/components/icon</a-tag>
        </header>

        <div class="grid gap-16">
          <div class="grid grid-cols-2 gap-10 sm:grid-cols-5 lg:grid-cols-10">
            <div
              v-for="name in iconSamples"
              :key="name"
              class="h-84 flex flex-col items-center justify-center gap-9 rounded-6 border-1 border-color-1 border-solid bg-fill-1 text-secondary"
            >
              <Icon :name="name" :size="24" />
              <span class="max-w-full truncate px-5 text-xs">
                {{ name.split(':')[1] }}
              </span>
            </div>
          </div>
          <a-alert
            show-icon
            type="info"
            message="装饰图标默认对辅助技术隐藏；表达语义时请设置 decorative=false 和 label。"
          />
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
