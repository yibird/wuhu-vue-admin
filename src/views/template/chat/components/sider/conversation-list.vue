<template>
  <div class="h-full flex flex-col">
    <Search />
    <!-- Tabs -->
    <Tabs v-model:active-key="activeKey" :items="tabItems" />

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-if="filteredConversations.length === 0"
        class="h-full flex items-center justify-center"
      >
        <div class="text-center text-regular">
          <Icon name="i-lucide:inbox" :size="40" class="mb-10 opacity-50" />
          <div>
            暂无{{
              activeTab === 'all'
                ? ''
                : activeTab === 'pinned'
                  ? '置顶'
                  : '消息'
            }}
          </div>
        </div>
      </div>
      <ul v-else>
        <li
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="p-10 cursor-pointer transition-all hover:bg-[#f5f5f5]"
          :class="[activeConversationId === conv.id ? 'bg-primary/8!' : '']"
          @click="handleSelect(conv)"
        >
          <div class="flex items-start gap-10">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <n-avatar
                :src="conv.avatar"
                :size="44"
                round
                fallback-src="https://i.pravatar.cc/100?img=1"
              />
              <!-- Online status -->
              <span
                v-if="conv.userInfo?.status"
                class="absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 border-white"
                :class="{
                  'bg-success': conv.userInfo.status === 'online',
                  'bg-regular': conv.userInfo.status === 'offline',
                  'bg-error': conv.userInfo.status === 'busy',
                  'bg-warning': conv.userInfo.status === 'away',
                }"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-10">
                <span class="font-500 text-main truncate">{{
                  conv.title
                }}</span>
                <span class="text-xs text-regular shrink-0">{{
                  conv.lastMessageTime
                }}</span>
              </div>
              <div class="flex items-center justify-between gap-10 mt-4">
                <span class="text-sm text-regular truncate">{{
                  conv.lastMessage
                }}</span>
                <div class="flex items-center gap-5 shrink-0">
                  <span
                    v-if="conv.unreadCount > 0"
                    class="min-w-18 h-18 px-4 flex items-center justify-center text-xs bg-primary text-white rounded-full"
                  >
                    {{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <!-- <div class="flex items-center gap-6 mt-8">
            <button
              class="p-6 rounded-4 hover:bg-[#e8e8e8] text-regular"
              title="置顶"
              @click.stop="$emit('pin', conv)"
            >
              <Icon name="i-lucide:pin" :size="14" />
            </button>
            <button
              class="p-6 rounded-4 hover:bg-[#e8e8e8] text-regular"
              title="免打扰"
              @click.stop="$emit('mute', conv)"
            >
              <Icon
                :name="conv.muted ? 'i-lucide:bell-off' : 'i-lucide:bell'"
                :size="14"
              />
            </button>
            <button
              class="p-6 rounded-4 hover:bg-[#e8e8e8] text-error"
              title="删除"
              @click.stop="$emit('delete', conv)"
            >
              <Icon name="i-lucide:trash-2" :size="14" />
            </button>
          </div> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from '../search.vue'
import Tabs from '../tabs.vue'
import { computed, ref } from 'vue'
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

const activeKey = ref('all')
const tabItems = [
  { key: 'all', label: '全部' },
  { key: 'pinned', label: '置顶' },
  { key: 'unread', label: '未读' },
]
const activeTab = ref('all')

const filteredConversations = computed(() => {
  let list = props.conversations

  if (activeTab.value === 'pinned') {
    list = list.filter((c) => c.pinned)
  } else if (activeTab.value === 'unread') {
    list = list.filter((c) => c.unreadCount > 0)
  }

  return list
})

function handleSelect(conv: Conversation) {
  emit('select', conv)
}
</script>
