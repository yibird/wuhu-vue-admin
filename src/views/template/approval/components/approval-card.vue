<template>
  <article
    class="group min-w-0 cursor-pointer overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container outline-none transition-[border-color,box-shadow,transform] duration-motion-moderate ease-motion-standard hover:(-translate-y-1 border-primary/40 shadow-[var(--w-shadow-card)])"
    role="button"
    tabindex="0"
    @click="emits('open', definition)"
    @keydown.enter.prevent="emits('open', definition)"
    @keydown.space.prevent="emits('open', definition)"
  >
    <div class="flex items-start gap-12 px-14 pb-12 pt-14">
      <span
        class="size-42 flex flex-none items-center justify-center rounded-7 bg-primary/10 text-primary transition-transform duration-motion-base group-hover:scale-105"
      >
        <Icon :name="definition.icon || 'i-lucide:workflow'" :size="21" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-8">
          <div class="min-w-0">
            <h2 class="m-0 truncate text-md text-main font-650">
              {{ definition.name }}
            </h2>
            <div class="mt-5 flex flex-wrap items-center gap-6">
              <a-tag :bordered="false" :color="stateMeta.color">
                {{ stateMeta.label }}
              </a-tag>
              <span class="text-xs text-secondary">{{ definition.code }}</span>
            </div>
          </div>

          <a-dropdown
            :menu="{ items: actionItems }"
            :trigger="['click']"
            @menu-click="handleAction"
          >
            <a-button
              type="text"
              size="small"
              aria-label="更多审批流操作"
              @click.stop
            >
              <template #icon>
                <Icon name="i-lucide:more-horizontal" />
              </template>
            </a-button>
          </a-dropdown>
        </div>

        <p
          class="m-0 mt-10 line-clamp-2 min-h-38 text-sm text-regular leading-19px"
        >
          {{ definition.description || '暂无描述' }}
        </p>
      </div>
    </div>

    <div
      class="mx-14 grid grid-cols-3 gap-8 border-t-1 border-color-1 border-t-solid py-10"
    >
      <span class="min-w-0 flex flex-col gap-3">
        <span class="text-xs text-muted">分组</span>
        <span class="truncate text-xs text-main">
          {{ definition.categoryName }}
        </span>
      </span>
      <span class="min-w-0 flex flex-col gap-3">
        <span class="text-xs text-muted">节点</span>
        <span class="text-xs text-main">{{ definition.nodeCount }}</span>
      </span>
      <span class="min-w-0 flex flex-col gap-3">
        <span class="text-xs text-muted">使用次数</span>
        <span class="text-xs text-main">{{ definition.instanceCount }}</span>
      </span>
    </div>

    <div class="flex items-center gap-10 px-14 pb-12 pt-2">
      <span
        class="size-28 flex flex-none items-center justify-center rounded-full bg-fill-secondary text-xs text-main font-700"
      >
        {{ definition.ownerName.slice(-1) }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs text-main">{{ definition.ownerName }}</div>
        <div class="mt-1 truncate text-xs text-secondary">
          更新于 {{ formatDateTime(definition.updatedAt) }}
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components'
import { renderIcon } from '@/utils'
import { definitionStateMeta, formatDateTime } from '../shared'
import type { ApprovalDefinitionResp } from '@/apis'
import type { MenuProps } from 'antdv-next'

const props = defineProps<{
  definition: ApprovalDefinitionResp
}>()

const emits = defineEmits<{
  /**
   * @desc 打开设计器
   * @param definition 审批流定义
   */
  open: [definition: ApprovalDefinitionResp]
  /**
   * @desc 复制审批流
   * @param definition 审批流定义
   */
  duplicate: [definition: ApprovalDefinitionResp]
  /**
   * @desc 删除审批流
   * @param definition 审批流定义
   */
  remove: [definition: ApprovalDefinitionResp]
}>()

const stateMeta = computed(() => definitionStateMeta[props.definition.state])

const actionItems: MenuProps['items'] = [
  { key: 'edit', label: '编辑流程', icon: renderIcon('i-lucide:pencil') },
  {
    key: 'duplicate',
    label: '创建副本',
    icon: renderIcon('i-lucide:copy-plus'),
  },
  { type: 'divider' },
  {
    key: 'remove',
    label: '删除流程',
    danger: true,
    icon: renderIcon('i-lucide:trash-2'),
  },
]

function handleAction(info: { key: string | number }) {
  const key = String(info.key)
  if (key === 'edit') {
    emits('open', props.definition)
    return
  }
  if (key === 'duplicate') {
    emits('duplicate', props.definition)
    return
  }
  if (key === 'remove') {
    emits('remove', props.definition)
  }
}
</script>
