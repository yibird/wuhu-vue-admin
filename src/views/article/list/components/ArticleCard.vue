<script setup lang="ts">
import { computed } from 'vue'
import { renderIcon } from '@/utils'
import { getArticleIconForeground } from '../../iconPalette'
import type { ArticleAction, ArticleItem } from '../../types'

const props = defineProps<{
  item: ArticleItem
}>()

const emit = defineEmits<{
  action: [key: ArticleAction, item: ArticleItem]
}>()

const iconStyle = computed(() => ({
  backgroundColor: props.item.iconBackground,
  color: getArticleIconForeground(props.item.iconBackground),
}))

const visibleTags = computed(() => props.item.tags.slice(0, 2))

const statusMeta = computed(() => {
  const map = {
    published: { label: '已发布', color: 'green' },
    draft: { label: '草稿', color: 'blue' },
    archived: { label: '已归档', color: 'default' },
  } as const
  return map[props.item.status]
})

const moreActionItems = computed(() => [
  ...(props.item.status !== 'published'
    ? [
        {
          key: 'publish',
          label: '发布文章',
          icon: renderIcon('i-lucide:send'),
        },
      ]
    : []),
  {
    key: 'duplicate',
    label: '创建副本',
    icon: renderIcon('i-lucide:copy-plus'),
  },
  { type: 'divider' },
  {
    key: 'archive',
    label: props.item.status === 'archived' ? '移出归档' : '归档',
    icon: renderIcon(
      props.item.status === 'archived'
        ? 'i-lucide:archive-restore'
        : 'i-lucide:archive'
    ),
  },
])

function handleAction(key: ArticleAction) {
  emit('action', key, props.item)
}

function handleMoreAction(info: { key: string | number }) {
  const key = String(info.key)
  if (key === 'archive' || key === 'duplicate' || key === 'publish') {
    handleAction(key)
  }
}

function formatNumber(value: number) {
  if (value >= 10_000) return (value / 10_000).toFixed(1) + 'w'
  if (value >= 1000) return (value / 1000).toFixed(1) + 'k'
  return String(value)
}
</script>

<template>
  <article
    class="group relative min-w-0 cursor-pointer overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)] outline-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-2 hover:border-primary/45 hover:shadow-[var(--w-shadow-elevated)] focus-visible:border-primary"
    :aria-label="'文章：' + props.item.title"
    role="button"
    tabindex="0"
    @dblclick="handleAction('open')"
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
        <div class="mb-8 flex min-w-0 items-center justify-between gap-6">
          <a-tag :bordered="false" :color="statusMeta.color" class="m-0">
            {{ statusMeta.label }}
          </a-tag>

          <div
            class="flex flex-none items-center gap-2"
            @click.stop
            @dblclick.stop
          >
            <a-tooltip title="编辑">
              <a-button
                type="text"
                size="small"
                class="text-primary hover:(bg-primary/10 text-primary)"
                :aria-label="'编辑' + props.item.title"
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
                class="text-error hover:(bg-error/10 text-error)"
                :aria-label="'删除' + props.item.title"
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
                class="text-secondary hover:(bg-hover text-main)"
                :aria-label="'更多' + props.item.title + '操作'"
              >
                <template #icon>
                  <Icon name="i-lucide:more-horizontal" />
                </template>
              </a-button>
            </a-dropdown>
          </div>
        </div>

        <h2 class="m-0 min-w-0 truncate text-md text-main font-700">
          {{ props.item.title }}
        </h2>
        <p class="m-0 mt-6 line-clamp-2 min-h-38 text-sm text-regular">
          {{ props.item.summary }}
        </p>

        <div class="mt-12 flex flex-wrap gap-6">
          <a-tag :bordered="false" color="processing" class="m-0">
            {{ props.item.category }}
          </a-tag>
          <a-tag
            v-for="tag in visibleTags"
            :key="tag"
            :bordered="false"
            class="m-0"
          >
            {{ tag }}
          </a-tag>
        </div>

        <div
          class="mt-14 flex items-center gap-14 border-t-1 border-color-1 border-t-solid pt-10 text-xs text-secondary"
        >
          <span class="flex items-center gap-4">
            <Icon name="i-lucide:eye" :size="14" class="text-secondary" />
            {{ formatNumber(props.item.views) }}
          </span>
          <span class="flex items-center gap-4">
            <Icon name="i-lucide:letter-text" :size="14" class="text-primary" />
            {{ formatNumber(props.item.wordCount) }} 字
          </span>
        </div>
      </div>
    </div>

    <footer
      class="flex min-w-0 items-center gap-10 border-t-1 border-color-2 border-t-solid px-14 py-12"
    >
      <span
        class="size-30 flex flex-none items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-700"
      >
        {{ props.item.author.name.slice(-1) }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs text-main">
          {{ props.item.author.name }}
        </div>
        <div class="mt-2 truncate text-xs text-secondary">
          {{ props.item.author.department }}
        </div>
      </div>
      <div class="min-w-0 text-right">
        <div class="text-xs text-secondary">最近更新</div>
        <div class="mt-2 truncate text-xs text-main">
          {{ props.item.updatedAt }}
        </div>
      </div>
    </footer>
  </article>
</template>
