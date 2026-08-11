<script setup lang="ts">
import { computed } from 'vue'
import { renderIcon } from '@/utils'
import { getKnowledgeBaseIconForeground } from '../../iconPalette'
import type { KnowledgeBaseAction, KnowledgeBaseItem } from '../../types'

const props = defineProps<{
  item: KnowledgeBaseItem
  subject: string
  statusLabels: Record<KnowledgeBaseItem['status'], string>
}>()

const emit = defineEmits<{
  action: [key: KnowledgeBaseAction, item: KnowledgeBaseItem]
}>()

const iconStyle = computed(() => ({
  backgroundColor: props.item.iconBackground,
  color: getKnowledgeBaseIconForeground(props.item.iconBackground),
}))

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
      class: 'bg-fill-tertiary text-secondary',
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
])

function handleAction(key: KnowledgeBaseAction) {
  emit('action', key, props.item)
}

function handleMoreAction(info: { key: string | number }) {
  const key = String(info.key)
  if (
    key === 'archive' ||
    key === 'duplicate' ||
    key === 'open' ||
    key === 'toggle'
  ) {
    handleAction(key)
  }
}
</script>

<template>
  <article
    class="group min-w-0 cursor-pointer overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)] outline-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-2 hover:border-primary/45 hover:shadow-[var(--w-shadow-elevated)] focus-visible:border-primary"
    :aria-label="`${props.subject}：${props.item.name}`"
    role="button"
    tabindex="0"
    @click="handleAction('open')"
    @keydown.enter="handleAction('open')"
    @keydown.space.prevent="handleAction('open')"
  >
    <div class="flex min-w-0 items-start gap-12 p-14">
      <span
        class="size-44 flex flex-none items-center justify-center rounded-8 shadow-[inset_0_0_0_1px_rgb(15_23_42_/_6%)] transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105"
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

          <div class="flex flex-none items-center gap-2" @click.stop>
            <a-tooltip title="编辑">
              <a-button
                type="text"
                size="small"
                :aria-label="`编辑${props.item.name}`"
                @click="handleAction('edit')"
              >
                <template #icon>
                  <Icon name="i-lucide:pencil" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="删除">
              <a-button
                danger
                type="text"
                size="small"
                :aria-label="`删除${props.item.name}`"
                @click="handleAction('delete')"
              >
                <template #icon>
                  <Icon name="i-lucide:trash-2" />
                </template>
              </a-button>
            </a-tooltip>
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
      </div>
    </div>

    <footer
      class="flex min-w-0 items-center gap-10 border-t-1 border-color-2 border-t-solid px-14 py-12"
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
