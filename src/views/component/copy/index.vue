<script setup lang="ts">
import { Copy, Icon } from '@/components'
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <div
      class="h-full min-h-full w-full p-16 md:p-20 overflow-x-hidden overflow-y-auto"
    >
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Copy</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              点击组件任意位置复制默认插槽中的文本，支持前缀、默认、后缀三个插槽。
            </p>
          </div>
          <a-tag color="blue">src/components/copy</a-tag>
        </header>

        <div class="grid gap-18">
          <div class="rounded-6 bg-fill-1 p-18">
            <p class="m-0 text-xs text-muted">默认用法</p>
            <Copy class="mt-8 text-sm text-main"> 需要复制的文本内容 </Copy>
          </div>

          <div class="rounded-6 bg-fill-1 p-18">
            <p class="m-0 text-xs text-muted">带前缀图标</p>
            <Copy class="mt-8 text-sm text-main">
              <template #prefix>
                <Icon name="i-lucide:link" :size="14" class="text-muted" />
              </template>
              https://github.com/yibird/wuhu-admin-vue
            </Copy>
          </div>

          <div class="rounded-6 bg-fill-1 p-18">
            <p class="m-0 text-xs text-muted">自定义后缀</p>
            <Copy class="mt-8 text-sm text-main">
              <template #prefix>任务编号：</template>
              TK-20251011-001
              <template #suffix>
                <a-tag :bordered="false" color="blue">复制</a-tag>
              </template>
            </Copy>
          </div>
        </div>
      </section>
    </div>
  </WView>
</template>
