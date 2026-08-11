<template>
  <Scrollbar class="min-h-0 flex-1 overflow-hidden">
    <div
      v-if="!collapsed && items.length === 0"
      class="min-h-220 flex flex-col items-center justify-center gap-8 p-24 text-center text-secondary"
    >
      <Icon name="i-lucide:messages-square" :size="28" />
      <strong class="text-sm text-main">{{ emptyText }}</strong>
      <span class="text-xs">{{ emptyHint }}</span>
    </div>

    <div
      v-else-if="items.length > 0"
      class="flex flex-col gap-3 px-8 pb-10 pt-4 max-lg:grid max-lg:grid-cols-[repeat(3,minmax(210px,1fr))] max-lg:overflow-x-auto max-sm:grid-cols-[repeat(3,minmax(196px,1fr))] max-sm:p-10"
    >
      <article
        v-for="item in items"
        :key="item.id"
        class="group relative min-h-42 w-full min-w-0 overflow-hidden rounded-10 border-1 border-transparent border-solid text-regular transition-[background-color,border-color,color] duration-150 ease-out hover:border-color-1 hover:bg-hover"
        :class="[
          item.id === activeId ? 'border-color-2! bg-hover! text-main' : '',
        ]"
      >
        <button
          type="button"
          class="min-h-42 w-full min-w-0 flex items-center border-0 bg-transparent text-left text-regular cursor-pointer"
          :class="collapsed ? 'h-42 justify-center p-8' : 'px-10 py-8 pr-118'"
          :title="item.title"
          @click="emit('change', item.id)"
        >
          <span
            class="relative min-w-0 w-full flex items-center justify-center"
          >
            <Icon
              name="i-lucide:message-square"
              :size="18"
              class="shrink-0 transition-[opacity,transform] duration-150 ease-out"
              :class="
                collapsed
                  ? 'scale-100 opacity-100'
                  : 'absolute scale-90 opacity-0 pointer-events-none'
              "
              :aria-hidden="!collapsed"
            />
            <span
              class="min-w-0 w-full flex flex-col gap-4 overflow-hidden transition-[max-width,opacity,transform] duration-150 ease-out"
              :class="
                collapsed
                  ? 'max-h-0 max-w-0 translate-x-4 opacity-0 pointer-events-none'
                  : 'max-h-88 max-w-256 translate-x-0 opacity-100'
              "
              :aria-hidden="collapsed"
              :inert="collapsed"
            >
              <span class="min-w-0 flex items-center gap-5">
                <Icon
                  v-if="item.pinned"
                  name="i-lucide:pin"
                  :size="12"
                  class="shrink-0 text-primary"
                />
                <strong
                  class="min-w-0 truncate text-13px text-main font-500 leading-19px"
                >
                  {{ item.title }}
                </strong>
              </span>
              <span class="truncate text-xs text-secondary leading-18px">
                {{ item.description }}
              </span>
              <span
                class="min-w-0 flex items-center justify-between gap-8 text-xs text-secondary leading-18px"
              >
                <span class="truncate">{{
                  item.updateTime ?? item.createTime
                }}</span>
                <span class="shrink-0 inline-flex items-center gap-4">
                  <span
                    class="size-5 rounded-full"
                    :class="statusClass(item)"
                  />
                  {{ statusLabel(item) }}
                </span>
              </span>
            </span>
          </span>
        </button>
        <div
          v-if="!collapsed"
          class="absolute right-8 top-8 flex items-center gap-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <button
            v-for="action in getActions(item)"
            :key="action.key"
            type="button"
            class="size-22 inline-flex items-center justify-center rounded-6 border-0 bg-transparent p-0 text-muted cursor-pointer transition-colors hover:bg-container hover:text-main"
            :class="action.danger ? 'hover:bg-error-tint hover:text-error' : ''"
            :aria-label="action.label"
            :title="action.label"
            @click="handleAction(action.key, item.id)"
          >
            <Icon :name="action.icon" :size="13" />
          </button>
        </div>
      </article>
    </div>
  </Scrollbar>
</template>

<script setup lang="ts">
import type { AgentStatus, ChatItem, ListEmits, ListProps } from '../types'

withDefaults(defineProps<ListProps>(), {
  items: () => [],
  activeId: '',
  collapsed: false,
  emptyText: '暂无会话记录',
  emptyHint: '点击上方按钮开始新会话',
})

const emit = defineEmits<ListEmits>()

const statusMap: Record<AgentStatus, { label: string; class: string }> = {
  ready: {
    label: '待命',
    class: 'bg-success',
  },
  running: {
    label: '运行中',
    class: 'bg-primary',
  },
  paused: {
    label: '暂停',
    class: 'bg-warning',
  },
}

type ChatActionKey = 'archive' | 'delete' | 'pin' | 'rename'

function getStatus(item: ChatItem) {
  return statusMap[item.status ?? 'ready']
}

function statusLabel(item: ChatItem) {
  return getStatus(item).label
}

function statusClass(item: ChatItem) {
  return getStatus(item).class
}

function getActions(item: ChatItem) {
  return [
    {
      key: 'pin' as const,
      label: item.pinned ? '取消置顶' : '置顶',
      icon: item.pinned ? 'i-lucide:pin-off' : 'i-lucide:pin',
    },
    {
      key: 'rename' as const,
      label: '重命名',
      icon: 'i-lucide:pencil',
    },
    {
      key: 'archive' as const,
      label: item.archived ? '恢复会话' : '归档',
      icon: item.archived ? 'i-lucide:archive-restore' : 'i-lucide:archive',
    },
    {
      key: 'delete' as const,
      label: '删除',
      icon: 'i-lucide:trash-2',
      danger: true,
    },
  ]
}

function handleAction(action: ChatActionKey, id: string) {
  ;(emit as (e: ChatActionKey, id: string) => void)(action, id)
}
</script>
