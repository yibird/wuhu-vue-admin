<template>
  <article
    class="group relative min-w-0 cursor-pointer overflow-hidden rounded-8 b-1-secondary bg-container transition-all hover:(-translate-y-2 border-primary shadow-lg) focus-visible:border-primary"
    :aria-label="'审批流：' + definition.name"
    role="button"
    tabindex="0"
    @click="emits('open', definition)"
    @keydown.enter.prevent="emits('open', definition)"
    @keydown.space.prevent="emits('open', definition)"
  >
    <div class="flex min-w-0 items-start gap-12 p-14">
      <span
        class="size-44 flex flex-none items-center justify-center rounded-8 inset-ring-1 inset-ring-ink/6 transition-transform duration-200 group-hover:(-rotate-3 scale-105)"
        :style="iconStyle"
      >
        <Icon :name="definition.icon || 'i-lucide:workflow'" :size="22" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="mb-8 flex min-w-0 items-center justify-between gap-6">
          <a-tag :bordered="false" :color="stateMeta.color" class="m-0">
            {{ stateMeta.label }}
          </a-tag>

          <div
            class="flex flex-none items-center gap-2"
            @click.stop
            @dblclick.stop
          >
            <a-dropdown
              :menu="{ items: actionItems }"
              :trigger="['click']"
              @menu-click="handleAction"
            >
              <a-button
                type="text"
                size="small"
                class="text-secondary hover:(bg-hover text-main)"
                aria-label="更多审批流操作"
                @click.stop
              >
                <template #icon>
                  <Icon name="i-lucide:ellipsis" />
                </template>
              </a-button>
            </a-dropdown>
          </div>
        </div>

        <h2 class="m-0 min-w-0 truncate text-md text-main font-700">
          {{ definition.name }}
        </h2>
        <p class="m-0 mt-6 line-clamp-2 min-h-38 text-sm text-regular">
          {{ definition.description || '暂无描述' }}
        </p>

        <div class="mt-12 flex flex-wrap gap-6">
          <a-tag :bordered="false" color="processing" class="m-0">
            {{ definition.code }}
          </a-tag>
        </div>

        <div class="mt-12 flex items-center gap-14 text-xs text-secondary">
          <span class="flex items-center gap-4">
            <Icon
              name="i-lucide:git-branch"
              :size="14"
              class="text-secondary"
            />
            {{ definition.nodeCount }} 个节点
          </span>
          <span class="flex items-center gap-4">
            <Icon name="i-lucide:activity" :size="14" class="text-primary" />
            {{ definition.instanceCount }} 次使用
          </span>
        </div>
      </div>
    </div>

    <footer
      class="flex min-w-0 items-center gap-10 b-t-1-secondary px-14 py-12"
    >
      <span
        class="size-30 flex flex-none items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-700"
      >
        {{ definition.ownerName.slice(-1) }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs text-main">{{ definition.ownerName }}</div>
        <div class="mt-2 truncate text-xs text-secondary">
          {{ definition.categoryName || '未分组' }}
        </div>
      </div>
      <div class="min-w-0 text-right">
        <div class="text-xs text-secondary">最近更新</div>
        <div class="mt-2 truncate text-xs text-main">
          {{ formatDateTime(definition.updatedAt) }}
        </div>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components/icon'
import { getIconPaletteColor, renderIcon } from '@/utils'
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

const iconStyle = computed(() => {
  const color = getIconPaletteColor(props.definition.id)
  return {
    backgroundColor: color.background,
    color: color.foreground,
  }
})

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
