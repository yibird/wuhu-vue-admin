<template>
  <div
    class="task-card-panel rounded-6 border-1 border-solid border-color-1 bg-container transition-[border-color,box-shadow] hover:shadow-all-md"
  >
    <div class="p-10 pb-6">
      <div class="flex items-start justify-between gap-8">
        <div class="min-w-0 text-sm text-main font-600 leading-20px">
          {{ item.title }}
        </div>
        <a-tag :bordered="false" :color="priorityMeta.color" class="shrink-0">
          <span class="inline-flex items-center gap-3">
            <Icon :name="priorityMeta.icon" :size="12" />
            {{ priorityMeta.label }}
          </span>
        </a-tag>
      </div>
    </div>
    <div class="px-10 text-xs text-secondary line-clamp-2">
      {{ item.description }}
    </div>
    <div
      v-if="item.module || item.estimatedHours || item.tags?.length"
      class="mt-8 px-10 flex flex-wrap items-center gap-6 text-11px text-secondary"
    >
      <a-tag v-if="item.module" :bordered="false" color="blue">
        {{ item.module }}
      </a-tag>
      <a-tag v-if="item.estimatedHours" :bordered="false" color="purple">
        {{ item.estimatedHours }}h
      </a-tag>
      <a-tag v-for="tag in item.tags ?? []" :key="tag" :bordered="false">
        {{ tag }}
      </a-tag>
    </div>
    <div class="my-10 px-10 flex items-center justify-between gap-8">
      <div class="min-w-0 flex items-center gap-8">
        <span
          class="size-26 shrink-0 flex items-center justify-center rounded-full text-xs font-600"
          :class="assigneeMeta.avatarClass"
        >
          {{ assigneeInitial }}
        </span>
        <div class="min-w-0">
          <div class="truncate text-xs text-main">{{ assigneeMeta.label }}</div>
          <div class="truncate text-11px text-secondary">
            {{ assigneeMeta.role }}
          </div>
        </div>
      </div>
      <span
        class="shrink-0 inline-flex items-center gap-4 text-xs"
        :class="dueMeta.class"
        :title="dueMeta.fullText"
      >
        <Icon :name="dueMeta.icon" :size="13" />
        {{ dueMeta.text }}
      </span>
    </div>
    <div
      class="p-10 flex items-center border-t-1 border-t-solid border-color-1"
    >
      <span
        class="flex-1 inline-flex items-center justify-center gap-4 text-xs text-muted cursor-pointer hover:text-primary"
        @click="emit('edit', item)"
      >
        <Icon name="i-lucide:pencil" :size="13" />
        修改
      </span>
      <a-divider vertical />
      <span
        class="flex-1 inline-flex items-center justify-center gap-4 text-xs text-muted cursor-pointer hover:text-error"
        @click="emit('delete', item)"
      >
        <Icon name="i-lucide:trash-2" :size="13" />
        删除
      </span>
      <a-divider vertical />
      <!-- 外层 div 负责三等分与居中,避免依赖 Dropdown 内部对触发元素 class 的处理 -->
      <div class="flex-1 flex items-center justify-center">
        <a-dropdown
          :trigger="['click']"
          :menu="{ items: menuItems }"
          @menu-click="handleMenuClick"
        >
          <button
            type="button"
            aria-label="更多操作"
            class="inline-flex items-center justify-center border-0 bg-transparent p-0 text-xs text-muted cursor-pointer transition-colors hover:text-primary"
          >
            <Icon name="i-lucide:ellipsis" :size="15" />
          </button>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { renderIcon } from '@/utils'
import {
  getTaskAssigneeMeta,
  getTaskDueMeta,
  getTaskPriorityMeta,
} from '../../constants'
import type { MenuProps } from 'antdv-next'
import type { CardTaskActionEmits, CardTaskItemProps } from '../types'

const { item } = defineProps<CardTaskItemProps>()
const emit = defineEmits<CardTaskActionEmits>()

const priorityMeta = computed(() => getTaskPriorityMeta(item.priority))
const assigneeMeta = computed(() => getTaskAssigneeMeta(item.assignee))
const dueMeta = computed(() => getTaskDueMeta(item.dueDate, item.status))
const assigneeInitial = computed(() => assigneeMeta.value.label.slice(0, 1))

type CardMenuItemKey = 'duplicate' | 'markDone'

/** 卡片底部已内联「修改 / 删除」,更多操作只补充其余动作 */
const menuItems = computed(
  () =>
    [
      {
        key: 'duplicate',
        label: '复制任务',
        icon: renderIcon('i-lucide:copy-plus', { size: 15 }),
      },
      {
        key: 'markDone',
        label: '标记完成',
        icon: renderIcon('i-lucide:circle-check', { size: 15 }),
        disabled: item.status === 2,
      },
    ] satisfies NonNullable<MenuProps['items']>
)

const menuActions: Record<CardMenuItemKey, () => void> = {
  duplicate: () => emit('duplicate', item),
  markDone: () => emit('markDone', item),
}

const isCardMenuItemKey = (value: unknown): value is CardMenuItemKey =>
  value === 'duplicate' || value === 'markDone'

const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (isCardMenuItemKey(key)) menuActions[key]()
}
</script>
