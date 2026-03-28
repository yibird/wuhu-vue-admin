<template>
  <aside
    class="w-280 min-w-280 h-full border-r-1 border-solid border-[#E8E8E8] bg-white"
  >
    <ConversationList
      v-if="activeKey === 'conversation'"
      :conversations="conversations"
      :active-conversation-id="activeConversationId"
      @select="handleConversationSelect"
    />
    <ContactList v-else-if="activeKey === 'contact'" :contacts="contacts" />
    <GroupList v-else-if="activeKey === 'group'" :groups="groups" />
    <div
      v-else-if="activeKey === 'setting'"
      class="h-full flex items-center justify-center text-regular"
    >
      设置功能开发中
    </div>
  </aside>
</template>
<script lang="ts" setup>
import ConversationList from './conversation-list.vue'
import ContactList from './contact-list.vue'
import GroupList from './group-list.vue'
import type { Contact, Conversation } from '../types'

const { activeKey } = defineProps<{ activeKey?: string }>()

const emit = defineEmits<{
  select: [conversation: Conversation]
}>()

const activeConversationId = defineModel<string>('activeConversationId', { default: '' })

function handleConversationSelect(conversation: Conversation) {
  activeConversationId.value = conversation.id
  emit('select', conversation)
}

// Mock data
const conversations = ref<Conversation[]>([
  {
    id: '1',
    type: 'private',
    title: '张三',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: '好的，明天见！',
    lastMessageTime: '10:30',
    unreadCount: 2,
    pinned: true,
    userInfo: {
      id: '1',
      name: '张三',
      status: 'online',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
  },
  {
    id: '2',
    type: 'private',
    title: '李四',
    avatar: 'https://i.pravatar.cc/100?img=2',
    lastMessage: '项目进展如何？',
    lastMessageTime: '09:15',
    unreadCount: 0,
    userInfo: {
      id: '2',
      name: '李四',
      status: 'offline',
      avatar: 'https://i.pravatar.cc/100?img=2',
    },
  },
  {
    id: '3',
    type: 'group',
    title: '产品研发群',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: '王五：代码已提交',
    lastMessageTime: '昨天',
    unreadCount: 5,
    groupInfo: { id: '3', name: '产品研发群', memberCount: 28 },
  },
  {
    id: '4',
    type: 'private',
    title: '王五',
    avatar: 'https://i.pravatar.cc/100?img=4',
    lastMessage: '辛苦了，早点休息',
    lastMessageTime: '昨天',
    unreadCount: 0,
    muted: true,
    userInfo: {
      id: '4',
      name: '王五',
      status: 'away',
      avatar: 'https://i.pravatar.cc/100?img=4',
    },
  },
])

const contacts = ref<Contact[]>([
  {
    id: '1',
    name: '张三',
    avatar: 'https://i.pravatar.cc/100?img=1',
    status: 'online',
  },
  {
    id: '2',
    name: '李四',
    avatar: 'https://i.pravatar.cc/100?img=2',
    status: 'offline',
  },
  {
    id: '3',
    name: '王五',
    avatar: 'https://i.pravatar.cc/100?img=3',
    status: 'busy',
  },
  {
    id: '4',
    name: '赵六',
    avatar: 'https://i.pravatar.cc/100?img=4',
    status: 'away',
  },
])

const groups = ref<Conversation[]>([
  {
    id: 'g1',
    type: 'group',
    title: '产品研发群',
    avatar: 'https://i.pravatar.cc/100?img=5',
    lastMessage: '代码审查完成',
    lastMessageTime: '10:30',
    unreadCount: 0,
    groupInfo: { id: 'g1', name: '产品研发群', memberCount: 28 },
  },
  {
    id: 'g2',
    type: 'group',
    title: '产品汪群',
    avatar: 'https://i.pravatar.cc/100?img=6',
    lastMessage: '明天评审',
    lastMessageTime: '昨天',
    unreadCount: 3,
    groupInfo: { id: 'g2', name: '产品汪群', memberCount: 15 },
  },
])
</script>
