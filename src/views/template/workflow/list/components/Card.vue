<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { renderIcon } from '@/utils'
import { workflowDefinitionStatusMeta } from '../../management/meta'
import type { WorkflowDefinition } from '../../management/types'

const props = defineProps<{
  workflow: WorkflowDefinition
}>()

const emit = defineEmits<{
  action: [key: 'delete' | 'duplicate' | 'toggle', workflow: WorkflowDefinition]
  open: [workflow: WorkflowDefinition]
}>()

const statusMeta = computed(
  () => workflowDefinitionStatusMeta[props.workflow.status]
)
const actionItems = computed(() => [
  {
    key: 'duplicate',
    label: '创建副本',
    icon: renderIcon('i-lucide:copy-plus'),
  },
  {
    key: 'toggle',
    label: props.workflow.status === 'disabled' ? '启用流程' : '停用流程',
    icon: renderIcon(
      props.workflow.status === 'disabled'
        ? 'i-lucide:circle-play'
        : 'i-lucide:circle-pause'
    ),
  },
])

function handleAction(info: { key: string | number }) {
  const key = String(info.key)
  if (key === 'delete' || key === 'duplicate' || key === 'toggle') {
    emit('action', key, props.workflow)
  }
}
</script>

<template>
  <Motion
    as="article"
    layout="position"
    :initial="{ opacity: 0, y: 10 }"
    :animate="{ opacity: 1, y: 0 }"
    :while-hover="{ y: -3 }"
    :while-press="{ scale: 0.995 }"
    :transition="{ type: 'spring', stiffness: 380, damping: 30, mass: 0.7 }"
    class="group min-w-0 cursor-pointer overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)] outline-none transition-[border-color,box-shadow] duration-motion-base hover:border-primary/45 hover:shadow-[var(--w-shadow-elevated)] focus-visible:border-primary"
    @click="emit('open', workflow)"
  >
    <div class="flex items-start gap-12 px-14 pb-12 pt-14">
      <span
        class="size-42 flex flex-none items-center justify-center rounded-7 bg-primary/10 text-primary transition-transform duration-motion-base group-hover:scale-105"
      >
        <Icon :name="workflow.icon" :size="21" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-8">
          <div class="min-w-0">
            <h2 class="m-0 truncate text-md text-main font-650">
              {{ workflow.name }}
            </h2>
            <div class="mt-5 flex flex-wrap items-center gap-6">
              <a-tag :bordered="false" :color="statusMeta.color">
                {{ statusMeta.label }}
              </a-tag>
              <span class="text-xs text-secondary">{{ workflow.version }}</span>
              <span class="text-placeholder">·</span>
              <span class="text-xs text-secondary">{{
                workflow.category
              }}</span>
            </div>
          </div>

          <div class="flex flex-none items-center gap-2">
            <a-tooltip title="删除流程">
              <a-button
                type="text"
                danger
                aria-label="删除流程"
                @click.stop="emit('action', 'delete', workflow)"
              >
                <template #icon>
                  <Icon name="i-lucide:trash-2" />
                </template>
              </a-button>
            </a-tooltip>
            <a-dropdown
              :trigger="['click']"
              :menu="{ items: actionItems }"
              @menu-click="handleAction"
            >
              <a-button type="text" aria-label="更多流程操作" @click.stop>
                <template #icon>
                  <Icon name="i-lucide:more-horizontal" />
                </template>
              </a-button>
            </a-dropdown>
          </div>
        </div>

        <p
          class="m-0 mt-10 line-clamp-2 min-h-38 text-sm text-regular leading-19px"
        >
          {{ workflow.description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-10 px-14 py-11">
      <span
        class="size-28 flex flex-none items-center justify-center rounded-full bg-fill-secondary text-xs text-main font-700"
      >
        {{ workflow.owner.name.slice(-1) }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs text-main">{{ workflow.owner.name }}</div>
        <div class="mt-1 truncate text-xs text-secondary">
          更新于 {{ workflow.updatedAt }}
        </div>
      </div>
      <a-button
        type="link"
        class="flex-none"
        @click.stop="emit('open', workflow)"
      >
        进入设计器
        <template #icon>
          <Icon name="i-lucide:arrow-up-right" />
        </template>
      </a-button>
    </div>
  </Motion>
</template>
