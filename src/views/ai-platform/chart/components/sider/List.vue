<template>
  <Scrollbar class="min-h-0 flex-1 overflow-hidden">
    <Transition name="fade" mode="out-in">
      <div
        v-if="!collapsed && items.length === 0"
        key="empty"
        class="min-h-220 flex flex-col items-center justify-center gap-8 p-24 text-center text-secondary"
      >
        <span
          class="size-48 flex items-center justify-center rounded-full bg-fill-tertiary text-muted"
        >
          <Icon name="i-lucide:messages-square" :size="24" />
        </span>
        <strong class="text-sm text-main">{{ emptyText }}</strong>
        <span class="text-xs">{{ emptyHint }}</span>
      </div>

      <TransitionGroup
        v-else-if="items.length > 0"
        key="list"
        name="fade-scale"
        tag="div"
        class="conversation-list relative flex flex-col gap-6 px-8 pb-10 pt-4 max-lg:grid max-lg:grid-cols-[repeat(3,minmax(210px,1fr))] max-lg:overflow-x-auto max-sm:grid-cols-[repeat(3,minmax(196px,1fr))] max-sm:p-10"
        leave-active-class="conversation-list-leave-active fade-scale-leave-active"
        move-class="list-move"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="conversation-list-item min-w-0"
        >
          <article
            class="group conversation-card relative min-h-48 w-full min-w-0 overflow-hidden rounded-8 border-1 border-transparent border-solid bg-container text-regular hover:(border-color-3 shadow-all-sm) focus-within:(border-primary/35 bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_10%)])"
            :class="
              item.id === activeId
                ? 'conversation-card--active border-primary/35! bg-selected! text-main shadow-all-sm'
                : ''
            "
          >
            <button
              type="button"
              class="min-h-48 w-full min-w-0 flex items-center border-0 bg-transparent text-left text-regular outline-none cursor-pointer"
              :class="collapsed ? 'h-48 justify-center p-6' : 'px-8 py-8 pr-40'"
              :title="item.title"
              :aria-current="item.id === activeId ? 'true' : undefined"
              @click="emit('change', item.id)"
            >
              <span
                class="min-w-0 w-full flex"
                :class="
                  collapsed
                    ? 'items-center justify-center'
                    : 'items-start justify-start gap-8'
                "
              >
                <span
                  class="size-28 flex shrink-0 items-center justify-center rounded-7 bg-fill-tertiary text-muted transition-[background-color,color,transform] duration-motion-fast ease-motion-enter group-hover:scale-105 motion-reduce:transform-none"
                  :class="
                    item.id === activeId ? 'bg-primary/12 text-primary' : ''
                  "
                >
                  <Icon name="i-lucide:message-square" :size="15" />
                </span>

                <span
                  class="min-w-0 flex-1 flex-col gap-6 overflow-hidden transition-[max-width,opacity,transform] duration-motion-fast ease-motion-enter motion-reduce:transition-none"
                  :class="
                    collapsed
                      ? 'hidden max-h-0 max-w-0 translate-x-4 opacity-0 pointer-events-none'
                      : 'flex max-h-88 max-w-256 translate-x-0 opacity-100'
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
                      class="min-w-0 truncate text-sm text-main font-600 leading-20px"
                    >
                      {{ item.title }}
                    </strong>
                  </span>
                  <span class="truncate text-xs text-secondary leading-18px">
                    {{ item.description }}
                  </span>
                  <span
                    class="min-w-0 flex items-center justify-between gap-8 text-11px text-muted leading-16px"
                  >
                    <span class="truncate">{{
                      item.updateTime ?? item.createTime
                    }}</span>
                    <span class="shrink-0 inline-flex items-center gap-4">
                      <span
                        class="size-5 rounded-full"
                        :class="statusClass(item)"
                      />
                      <span class="text-secondary">{{
                        statusLabel(item)
                      }}</span>
                    </span>
                  </span>
                </span>
              </span>
            </button>
            <div
              v-if="!collapsed"
              class="absolute right-7 top-7 translate-x-4 flex items-center rounded-6 bg-container/92 p-1 opacity-0 shadow-all-sm backdrop-blur-6 transition-[opacity,transform] duration-motion-fast ease-motion-enter group-focus-within:(translate-x-0 opacity-100) group-hover:(translate-x-0 opacity-100) motion-reduce:(transform-none transition-none)"
            >
              <a-dropdown :trigger="['click']" :menu="getActionMenu(item)">
                <button
                  type="button"
                  class="size-22 inline-flex items-center justify-center rounded-5 border-0 bg-transparent p-0 text-muted cursor-pointer transition-[background-color,color,transform] duration-motion-fast hover:(bg-white text-main -translate-y-1) focus-visible:(bg-white text-main outline-none) active:(translate-y-0 scale-90) motion-reduce:(transform-none transition-none)"
                  :aria-label="`更多${item.title}操作`"
                  title="更多操作"
                >
                  <Icon name="i-lucide:more-horizontal" :size="14" />
                </button>
              </a-dropdown>
            </div>
          </article>
        </div>
      </TransitionGroup>
    </Transition>
  </Scrollbar>
</template>

<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import { renderIcon } from '@/utils'
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

function getActionMenu(item: ChatItem) {
  const items: MenuProps['items'] = [
    {
      key: 'pin',
      label: item.pinned ? '取消置顶' : '置顶',
      icon: renderIcon(item.pinned ? 'i-lucide:pin-off' : 'i-lucide:pin'),
    },
    {
      key: 'rename',
      label: '重命名',
      icon: renderIcon('i-lucide:pencil'),
    },
    {
      key: 'archive',
      label: item.archived ? '恢复会话' : '归档',
      icon: renderIcon(
        item.archived ? 'i-lucide:archive-restore' : 'i-lucide:archive'
      ),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: '删除',
      danger: true,
      icon: renderIcon('i-lucide:trash-2'),
    },
  ]

  return {
    items,
    onClick: ({ key }: { key: string | number }) => {
      const action = String(key)
      if (
        action === 'archive' ||
        action === 'delete' ||
        action === 'pin' ||
        action === 'rename'
      ) {
        handleAction(action, item.id)
      }
    },
  }
}

function handleAction(action: ChatActionKey, id: string) {
  ;(emit as (e: ChatActionKey, id: string) => void)(action, id)
}
</script>

<style scoped>
.conversation-card {
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-spring),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-spring),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-spring),
    color var(--w-motion-duration-base) var(--w-motion-ease-spring),
    scale var(--w-motion-duration-base) var(--w-motion-ease-spring);
}

.conversation-card:active {
  scale: 0.98;
}

.conversation-card--active {
  animation: conversation-card-pop var(--w-motion-duration-moderate)
    var(--w-motion-ease-spring);
}

@keyframes conversation-card-pop {
  from {
    scale: 0.96;
  }

  to {
    scale: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .conversation-card {
    transition: none;
  }

  .conversation-card:active {
    scale: 1;
  }

  .conversation-card--active {
    animation: none;
  }
}

@media (width >= 1025px) {
  .conversation-list-leave-active {
    position: absolute;
    right: 8px;
    left: 8px;
    z-index: 1;
    pointer-events: none;
  }
}
</style>
