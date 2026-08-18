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
        class="conversation-list relative flex flex-col gap-4 px-8 pb-10 pt-4 max-lg:grid max-lg:grid-cols-[repeat(3,minmax(210px,1fr))] max-lg:overflow-x-auto max-sm:grid-cols-[repeat(3,minmax(196px,1fr))] max-sm:p-10"
        leave-active-class="conversation-list-leave-active fade-scale-leave-active"
        move-class="conversation-list-move"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="conversation-list-item min-w-0"
        >
          <article
            class="group relative min-h-48 w-full min-w-0 overflow-hidden rounded-8 border-1 border-transparent border-solid bg-container text-regular transition-[background-color,border-color,box-shadow,color,transform] duration-motion-base ease-motion-enter hover:(-translate-y-1 border-color-3 bg-hover shadow-all-sm) focus-within:(border-primary/35 bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_10%)]) active:translate-y-0 motion-reduce:(transform-none transition-none)"
            :class="
              item.id === activeId
                ? 'border-primary/35! bg-selected! text-main shadow-all-sm'
                : ''
            "
          >
            <button
              type="button"
              class="min-h-48 w-full min-w-0 flex items-center border-0 bg-transparent text-left text-regular outline-none cursor-pointer"
              :class="
                collapsed ? 'h-48 justify-center p-6' : 'px-8 py-8 pr-104'
              "
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
                  class="min-w-0 flex-1 flex-col gap-3 overflow-hidden transition-[max-width,opacity,transform] duration-motion-fast ease-motion-enter motion-reduce:transition-none"
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
                      class="min-w-0 truncate text-13px text-main font-600 leading-19px"
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
              class="absolute right-7 top-7 translate-x-4 flex items-center gap-2 rounded-6 bg-container/92 p-1 opacity-0 shadow-all-sm backdrop-blur-6 transition-[opacity,transform] duration-motion-fast ease-motion-enter group-focus-within:(translate-x-0 opacity-100) group-hover:(translate-x-0 opacity-100) motion-reduce:(transform-none transition-none)"
            >
              <button
                v-for="action in getActions(item)"
                :key="action.key"
                type="button"
                class="size-22 inline-flex items-center justify-center rounded-5 border-0 bg-transparent p-0 text-muted cursor-pointer transition-[background-color,color,transform] duration-motion-fast hover:(bg-hover text-main -translate-y-1) focus-visible:(bg-hover text-main outline-none) active:(translate-y-0 scale-90) motion-reduce:(transform-none transition-none)"
                :class="
                  action.danger ? 'hover:bg-error-tint hover:text-error' : ''
                "
                :aria-label="action.label"
                :title="action.label"
                @click="handleAction(action.key, item.id)"
              >
                <Icon :name="action.icon" :size="13" />
              </button>
            </div>
          </article>
        </div>
      </TransitionGroup>
    </Transition>
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

<style scoped>
.conversation-list-item {
  transform-origin: center;
  backface-visibility: hidden;
}

.conversation-list-move {
  transition: transform var(--w-motion-duration-moderate)
    var(--w-motion-ease-enter);
  will-change: transform;
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

@media (prefers-reduced-motion: reduce) {
  .conversation-list-move {
    transition: none;
    will-change: auto;
  }
}
</style>
