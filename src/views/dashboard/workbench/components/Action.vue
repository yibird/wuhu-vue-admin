<template>
  <section data-swapy-slot="action" class="page-enter page-enter--5 min-w-0">
    <a-card
      size="small"
      :segmented="{ content: true }"
      content-class="p-0!"
      data-swapy-item="action"
    >
      <template #header>
        <span class="text-base text-main font-700">快捷操作</span>
      </template>
      <template #header-extra>
        <a-button type="link" size="small">管理</a-button>
      </template>

      <div class="grid grid-cols-2 gap-8 p-12 sm:grid-cols-4 lg:grid-cols-2">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="group min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container p-12 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 hover:(-translate-y-1 border-color-primary bg-primary/5 shadow-all-sm) focus-visible:(border-color-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/12%)]) active:translate-y-0"
          @click="handleActionClick(item)"
        >
          <span
            class="size-34 flex items-center justify-center rounded-8 transition-transform duration-200 group-hover:scale-108"
            :class="[item.tone, item.text]"
          >
            <Icon :name="item.icon" :size="18" />
          </span>
          <span class="mt-10 block truncate text-sm text-main font-600">
            {{ item.name }}
          </span>
          <span class="mt-4 block truncate text-xs text-secondary">
            {{ item.desc }}
          </span>
        </button>

        <button
          type="button"
          class="group min-w-0 rounded-8 border-1 border-color-2 border-dashed bg-container p-12 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 hover:(-translate-y-1 border-color-primary bg-hover shadow-all-sm) focus-visible:(border-color-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/12%)]) active:translate-y-0"
        >
          <span
            class="size-34 flex items-center justify-center rounded-8 bg-fill-tertiary text-secondary transition-transform duration-200 group-hover:rotate-90 group-hover:scale-108"
          >
            <Icon name="i-lucide:plus" :size="18" />
          </span>
          <span class="mt-10 block truncate text-sm text-main font-600">
            添加入口
          </span>
          <span class="mt-4 block truncate text-xs text-secondary">
            自定义常用操作
          </span>
        </button>
      </div>
    </a-card>
  </section>
</template>

<script lang="ts" setup>
import type { WorkbenchAction } from './types'

const emit = defineEmits<{
  createProject: []
}>()

const items: WorkbenchAction[] = [
  {
    id: 1,
    icon: 'i-lucide:plus-circle',
    name: '新建项目',
    desc: '创建交付空间',
    tone: 'icon-primary-soft',
    text: 'text-primary',
  },
  {
    id: 2,
    icon: 'i-lucide:clipboard-check',
    name: '创建任务',
    desc: '分配负责人',
    tone: 'bg-success-tint',
    text: 'text-success',
  },
  {
    id: 3,
    icon: 'i-lucide:file-search',
    name: '需求评审',
    desc: '查看待评审',
    tone: 'bg-warning-tint',
    text: 'text-warning',
  },
  {
    id: 4,
    icon: 'i-lucide:message-square-plus',
    name: '团队同步',
    desc: '发起会议纪要',
    tone: 'bg-info-tint',
    text: 'text-info',
  },
]

function handleActionClick(item: WorkbenchAction) {
  if (item.id === 1) {
    emit('createProject')
  }
}
</script>
