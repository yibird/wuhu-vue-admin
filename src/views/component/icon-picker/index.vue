<script setup lang="ts">
import { IconPicker, Scrollbar } from '@/components'

const selectedIcon = shallowRef('i-lucide:sparkles')
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
            <h1 class="m-0 text-xl text-main font-600">IconPicker</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              适用于大规模图标浏览的弹窗选择器，支持分类、搜索与分组展示。
            </p>
          </div>
          <a-tag color="blue">src/components/icon-picker</a-tag>
        </header>

        <div class="grid max-w-640 gap-18">
          <div>
            <label class="mb-7 block text-sm text-main font-500">
              功能图标
            </label>
            <IconPicker
              v-model:value="selectedIcon"
              clear-text="清除图标"
              empty-text="没有匹配的图标"
              placeholder="请选择图标"
              search-placeholder="搜索图标"
              title="选择功能图标"
            />
          </div>
          <a-alert
            show-icon
            type="success"
            :message="`已选择：${selectedIcon || '无'}`"
          />
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
