<template>
  <article
    class="group min-w-0 flex flex-col cursor-pointer overflow-hidden rounded-8 b-1-regular bg-container shadow-card outline-none transition-[border-color,box-shadow,transform] duration-motion-base hover:(-translate-y-2) hover:border-primary hover:shadow-overlay focus-visible:border-primary"
    :aria-label="`${props.subject}：${props.item.name}`"
    role="button"
    tabindex="0"
    @dblclick="handleAction('open')"
    @keydown.enter="handleAction('open')"
    @keydown.space.prevent="handleAction('open')"
  >
    <div class="flex min-w-0 items-start gap-12 p-14">
      <span
        class="size-44 flex flex-none items-center justify-center rounded-8 shadow-[inset_0_0_0_1px_rgb(15_23_42_/_6%)] transition-transform duration-motion-base group-hover:-rotate-3 group-hover:scale-105"
        :style="iconStyle"
      >
        <Icon :name="props.item.icon" :size="22" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 items-start justify-between gap-8">
          <div class="min-w-0">
            <div class="flex min-w-0 items-center gap-8">
              <h2 class="m-0 truncate text-md text-main font-700">
                {{ props.item.name }}
              </h2>
              <a-tag :bordered="false" :color="statusMeta.color">
                {{ statusMeta.label }}
              </a-tag>
            </div>
            <p class="m-0 mt-6 line-clamp-2 min-h-38 text-sm text-regular">
              {{ props.item.description }}
            </p>
          </div>

          <div
            class="flex flex-none items-center gap-2"
            @click.stop
            @dblclick.stop
          >
            <a-dropdown
              :trigger="['click']"
              :menu="{ items: moreActionItems }"
              @menu-click="handleMoreAction"
            >
              <a-button
                type="text"
                size="small"
                :aria-label="`更多${props.item.name}操作`"
              >
                <template #icon>
                  <Icon name="i-lucide:more-horizontal" />
                </template>
              </a-button>
            </a-dropdown>
          </div>
        </div>

        <div class="mt-12 flex flex-wrap gap-6">
          <a-tag
            v-for="tag in props.item.tags"
            :key="tag"
            :bordered="false"
            class="m-0"
          >
            {{ tag }}
          </a-tag>
        </div>

        <div
          class="mt-10 flex min-w-0 flex-wrap items-center gap-x-12 gap-y-4 text-xs text-secondary"
        >
          <span class="min-w-0 inline-flex items-center gap-4">
            <Icon name="i-lucide:cpu" :size="13" />
            <span class="truncate">{{ modelLabel }}</span>
          </span>
          <span class="inline-flex items-center gap-4">
            <Icon name="i-lucide:sparkles" :size="13" />
            {{ props.item.skillIds.length }} 项技能
          </span>
          <span class="inline-flex items-center gap-4">
            <Icon name="i-lucide:library-big" :size="13" />
            {{ props.item.knowledgeBaseIds.length }} 个知识库
          </span>
          <span
            v-if="props.item.subAgentIds.length > 0"
            class="inline-flex items-center gap-4"
          >
            <Icon name="i-lucide:git-fork" :size="13" />
            {{ props.item.subAgentIds.length }} 个子 Agent
          </span>
        </div>
      </div>
    </div>

    <footer
      class="mt-auto flex min-w-0 items-center gap-10 b-t-1-regular px-14 py-12"
    >
      <span
        class="size-30 flex flex-none items-center justify-center rounded-full text-xs text-white font-700"
        :class="statusMeta.class"
      >
        {{ props.item.creator.name.slice(-1) }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs text-main">
          创建人：{{ props.item.creator.name }}
        </div>
        <div class="mt-2 truncate text-xs text-secondary">
          {{ props.item.creator.role }}
        </div>
      </div>
      <div class="min-w-0 text-right">
        <div class="mt-2 truncate text-xs text-main">
          {{ props.item.createdAt }}
        </div>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { renderIcon } from '@/utils'
import { getAgentModelLabel } from '../data'
import { getAgentIconForeground } from '../icon-palette'
import type { AgentAction, AgentItem } from '../types'

const props = defineProps<{
  item: AgentItem
  subject: string
  statusLabels: Record<AgentItem['status'], string>
}>()

const emits = defineEmits<{
  action: [key: AgentAction, item: AgentItem]
}>()

const iconStyle = computed(() => ({
  backgroundColor: props.item.iconBackground,
  color: getAgentIconForeground(props.item.iconBackground),
}))

const modelLabel = computed(() => getAgentModelLabel(props.item.modelId))

const statusMeta = computed(() => {
  const map = {
    online: {
      label: props.statusLabels.online,
      color: 'green',
      class: 'bg-success/10 text-success',
    },
    draft: {
      label: props.statusLabels.draft,
      color: 'blue',
      class: 'bg-primary/10 text-primary',
    },
    offline: {
      label: props.statusLabels.offline,
      color: 'default',
      class: 'bg-muted text-secondary',
    },
  } as const

  return map[props.item.status]
})

const moreActionItems = computed(() => [
  {
    key: 'open',
    label: '查看详情',
    icon: renderIcon('i-lucide:arrow-up-right'),
  },
  {
    key: 'edit',
    label: '编辑',
    icon: renderIcon('i-lucide:pencil'),
  },
  {
    key: 'duplicate',
    label: '创建副本',
    icon: renderIcon('i-lucide:copy-plus'),
  },
  {
    key: 'toggle',
    label: props.item.status === 'online' ? '停用' : '启用',
    icon: renderIcon(
      props.item.status === 'online'
        ? 'i-lucide:circle-pause'
        : 'i-lucide:circle-play'
    ),
  },
  { type: 'divider' },
  {
    key: 'archive',
    label: '归档',
    icon: renderIcon('i-lucide:archive'),
  },
  { type: 'divider' },
  {
    key: 'delete',
    label: '删除',
    danger: true,
    icon: renderIcon('i-lucide:trash-2'),
  },
])

function handleAction(key: AgentAction) {
  emits('action', key, props.item)
}

function handleMoreAction(info: { key: string | number }) {
  const key = String(info.key)
  if (
    ['archive', 'delete', 'duplicate', 'edit', 'open', 'toggle'].includes(key)
  ) {
    handleAction(key as AgentAction)
  }
}
</script>
