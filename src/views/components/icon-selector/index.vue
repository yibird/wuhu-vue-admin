<script setup lang="ts">
import { shallowRef } from 'vue'
import { Icon } from '@/components/icon'
import { IconSelector } from '@/components/iconPicker'
import { Scrollbar } from '@/components/scrollbar'

const selectedIcon = shallowRef('i-lucide:scan-barcode')
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
            <h1 class="m-0 text-xl text-main font-600">IconSelector</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              基于 Antdv Select 的完整 Lucide
              图标选择器，支持分类、搜索和虚拟滚动。
            </p>
          </div>
          <a-tag color="blue">1817 icons</a-tag>
        </header>

        <div class="grid max-w-720 gap-18">
          <div>
            <label class="mb-7 block text-sm text-main font-500">
              菜单图标
            </label>
            <IconSelector
              v-model:value="selectedIcon"
              empty-text="没有匹配的图标"
              placeholder="请选择图标"
              search-placeholder="搜索图标名称"
              title="Lucide 图标库"
            />
          </div>

          <div
            class="min-h-72 flex items-center gap-14 rounded-6 border-1 border-color-1 border-solid bg-fill-1 px-16"
          >
            <div
              class="size-44 flex shrink-0 items-center justify-center rounded-6 bg-selected text-primary"
            >
              <Icon
                :name="selectedIcon || 'i-lucide:circle-dashed'"
                :size="26"
              />
            </div>
            <div class="min-w-0">
              <p class="m-0 text-xs text-muted">当前图标</p>
              <code class="block truncate text-sm text-main">
                {{ selectedIcon || '尚未选择' }}
              </code>
            </div>
          </div>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
