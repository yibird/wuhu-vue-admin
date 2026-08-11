<template>
  <div class="h-full flex flex-col">
    <Search
      v-model="keyword"
      placeholder="搜索会话…"
      @create-group="emit('createGroup')"
      @add-contact="emit('addContact')"
      @open-global-search="emit('openGlobalSearch')"
    />
    <Tabs v-model:active-key="activeTab" :items="tabItems" />

    <VirtualList
      class="flex-1"
      aria-label="会话列表"
      :items="filteredConversations"
      :estimate-size="72"
      :get-item-key="(conversation) => conversation.id"
    >
      <template #default="{ item: conv }">
        <div class="px-8 py-2">
          <a-dropdown :trigger="['contextmenu']" :menu="getActionMenu(conv)">
            <button
              type="button"
              class="group relative box-border block w-full rounded-6 border-0 p-10 text-left cursor-pointer transition-[background-color,box-shadow,transform] duration-180 ease-out hover:translate-x-1 active:scale-99 focus-visible:(outline-none shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)]) motion-reduce:(transform-none transition-none)"
              :class="
                activeConversationId === conv.id
                  ? 'bg-primary/10 hover:bg-primary/14'
                  : 'bg-transparent hover:bg-hover'
              "
              :aria-current="
                activeConversationId === conv.id ? 'true' : undefined
              "
              :aria-label="`打开会话${conv.title}`"
              @click="handleSelect(conv)"
              @contextmenu.stop
            >
              <span
                v-if="activeConversationId === conv.id"
                class="pointer-events-none absolute left-0 top-1/2 h-30 w-3 -translate-y-1/2 rounded-r-full bg-primary"
              />
              <div class="flex items-start gap-10">
                <div class="relative shrink-0">
                  <a-avatar
                    :src="conv.avatar"
                    :size="44"
                    round
                    fallback-src="https://i.pravatar.cc/100?img=1"
                    class="transition-transform duration-180 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  />
                  <span
                    v-if="conv.userInfo?.status"
                    class="absolute bottom-0 right-0 size-10 rounded-full border-2 border-container"
                    :class="{
                      'bg-success': conv.userInfo.status === 'online',
                      'bg-fill': conv.userInfo.status === 'offline',
                      'bg-error': conv.userInfo.status === 'busy',
                      'bg-warning': conv.userInfo.status === 'away',
                    }"
                  />
                </div>

                <div class="min-w-0 flex-1 pt-1">
                  <div class="min-w-0 flex items-center gap-6">
                    <span
                      v-if="conv.mentioned"
                      class="rounded-4 bg-error-tint px-5 py-1 text-10px text-error leading-14px"
                    >
                      @我
                    </span>
                    <span
                      class="block min-w-0 truncate text-sm"
                      :class="
                        activeConversationId === conv.id
                          ? 'text-primary font-600'
                          : 'text-main font-500'
                      "
                      :title="conv.title"
                    >
                      {{ conv.title }}
                    </span>
                  </div>
                  <div class="mt-5 flex-1">
                    <span
                      class="block truncate text-sm text-secondary"
                      :title="conv.lastMessage"
                    >
                      {{ conv.lastMessage }}
                    </span>
                  </div>
                </div>

                <div
                  class="shrink-0 flex flex-col items-end justify-between gap-6"
                >
                  <span
                    class="whitespace-nowrap text-xs text-secondary leading-18px"
                  >
                    {{ conv.lastMessageTime }}
                  </span>
                  <div class="min-h-20 flex items-center justify-end gap-5">
                    <Icon
                      v-if="conv.pinned"
                      name="i-lucide:pin"
                      :size="13"
                      class="text-primary"
                    />
                    <Icon
                      v-if="conv.muted"
                      name="i-lucide:bell-off"
                      :size="13"
                      class="text-secondary"
                    />
                    <Icon
                      v-if="conv.archived"
                      name="i-lucide:archive"
                      :size="13"
                      class="text-secondary"
                    />
                    <a-badge
                      v-if="conv.unreadCount > 0"
                      :count="conv.unreadCount"
                      :overflow-count="99"
                      :number-style="{
                        height: '18px',
                        minWidth: '18px',
                        padding: '0 5px',
                        fontSize: '11px',
                        lineHeight: '18px',
                      }"
                    />
                  </div>
                </div>
              </div>
            </button>
          </a-dropdown>
        </div>
      </template>

      <template #empty>
        <div class="h-full flex items-center justify-center">
          <div class="text-center text-regular">
            <Icon name="i-lucide:inbox" :size="40" class="mb-10 opacity-50" />
            <div>暂无{{ emptyStateLabel }}</div>
          </div>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components'
import Search from '../Search.vue'
import Tabs from '../Tabs.vue'
import VirtualList from '../VirtualList.vue'
import { h } from 'vue'
import type { MenuProps } from 'antdv-next'
import type { Conversation, ConversationListEmits } from '../types'

interface Props {
  conversations?: Conversation[]
  activeConversationId?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  conversations: () => [],
  activeConversationId: '',
  loading: false,
})

const emit = defineEmits<ConversationListEmits>()

const tabItems = [
  { key: 'all', label: '全部' },
  { key: 'pinned', label: '置顶' },
  { key: 'unread', label: '未读' },
  { key: 'mentioned', label: '@我' },
  { key: 'muted', label: '静音' },
  { key: 'archived', label: '归档' },
]
const activeTab = shallowRef('all')
const keyword = shallowRef('')

const filteredConversations = computed(() => {
  let list = props.conversations

  if (activeTab.value !== 'archived') {
    list = list.filter((c) => !c.archived)
  }

  switch (activeTab.value) {
    case 'pinned':
      list = list.filter((c) => c.pinned)
      break
    case 'unread':
      list = list.filter((c) => c.unreadCount > 0)
      break
    case 'mentioned':
      list = list.filter((c) => c.mentioned)
      break
    case 'muted':
      list = list.filter((c) => c.muted)
      break
    case 'archived':
      list = list.filter((c) => c.archived)
      break
  }

  const normalizedKeyword = keyword.value.trim().toLowerCase()
  if (normalizedKeyword) {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedKeyword) ||
        item.lastMessage?.toLowerCase().includes(normalizedKeyword)
    )
  }

  return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned))
})

const emptyStateLabel = computed(() => {
  const labels: Record<string, string> = {
    all: '会话',
    pinned: '置顶',
    unread: '未读',
    mentioned: '@我',
    muted: '静音',
    archived: '归档',
  }
  return labels[activeTab.value] ?? '会话'
})

function handleSelect(conv: Conversation) {
  emit('select', conv)
}

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 15 })
}

function getActionMenu(conversation: Conversation) {
  const items: MenuProps['items'] = [
    {
      key: 'pin',
      label: conversation.pinned ? '取消置顶' : '置顶会话',
      icon: renderMenuIcon(
        conversation.pinned ? 'i-lucide:pin-off' : 'i-lucide:pin'
      ),
    },
    {
      key: 'mute',
      label: conversation.muted ? '取消免打扰' : '消息免打扰',
      icon: renderMenuIcon(
        conversation.muted ? 'i-lucide:bell' : 'i-lucide:bell-off'
      ),
    },
    {
      key: 'markUnread',
      label: '标为未读',
      icon: renderMenuIcon('i-lucide:badge'),
    },
    {
      key: 'archive',
      label: conversation.archived ? '移出归档' : '归档会话',
      icon: renderMenuIcon(
        conversation.archived ? 'i-lucide:archive-restore' : 'i-lucide:archive'
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: '删除会话',
      danger: true,
      icon: renderMenuIcon('i-lucide:trash-2'),
    },
  ]

  return {
    items,
    onClick: ({ key }: { key: string }) => handleAction(conversation, key),
  }
}

function handleAction(conversation: Conversation, key: string) {
  switch (key) {
    case 'pin':
      emit('pin', conversation)
      break
    case 'mute':
      emit('mute', conversation)
      break
    case 'markUnread':
      emit('markUnread', conversation)
      break
    case 'archive':
      emit('archive', conversation)
      break
    case 'delete':
      emit('delete', conversation)
      break
  }
}
</script>
