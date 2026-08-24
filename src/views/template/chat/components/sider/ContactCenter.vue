<template>
  <div class="h-full min-h-0 flex flex-col">
    <Search
      v-model="keyword"
      placeholder="搜索好友或群聊…"
      @create-group="emit('createGroup')"
      @add-contact="emit('addContact')"
      @open-global-search="emit('openGlobalSearch')"
    />

    <section class="border-b-1 border-b-solid border-color-1 px-10 py-10">
      <div class="mb-8 flex items-center justify-between">
        <span class="text-xs text-main font-600">通知</span>
        <span class="text-xs text-placeholder">
          {{
            unreadNotificationCount
              ? `${unreadNotificationCount} 条未读`
              : '已读完'
          }}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-8">
        <button
          type="button"
          class="group min-w-0 flex items-center gap-8 rounded-6 border-1 border-color-1 border-solid bg-container p-8 text-left transition-[border-color,background-color,box-shadow,transform] duration-motion-base hover:(translate-y--1 border-color-primary bg-hover shadow-all-sm) focus-visible:(outline-none border-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)]) motion-reduce:(transform-none transition-none)"
          aria-label="打开好友通知"
          @click="openNotification('friend')"
        >
          <span
            class="size-30 shrink-0 flex items-center justify-center rounded-5 bg-primary-tint text-primary transition-transform duration-motion-base group-hover:scale-105 motion-reduce:transform-none"
          >
            <Icon name="i-lucide:user-round-plus" :size="15" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs text-main font-500">
              好友通知
            </span>
            <span class="mt-2 block truncate text-xs text-secondary">
              {{ friendNotifications.length }} 条通知
            </span>
          </span>
          <a-badge
            :count="getUnreadCount('friend')"
            :overflow-count="99"
            :show-zero="false"
          />
        </button>
        <button
          type="button"
          class="group min-w-0 flex items-center gap-8 rounded-6 border-1 border-color-1 border-solid bg-container p-8 text-left transition-[border-color,background-color,box-shadow,transform] duration-motion-base hover:(translate-y--1 border-color-primary bg-hover shadow-all-sm) focus-visible:(outline-none border-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)]) motion-reduce:(transform-none transition-none)"
          aria-label="打开群聊通知"
          @click="openNotification('group')"
        >
          <span
            class="size-30 shrink-0 flex items-center justify-center rounded-5 bg-primary-tint text-primary transition-transform duration-motion-base group-hover:scale-105 motion-reduce:transform-none"
          >
            <Icon name="i-lucide:messages-square" :size="15" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs text-main font-500">
              群聊通知
            </span>
            <span class="mt-2 block truncate text-xs text-secondary">
              {{ groupNotifications.length }} 条通知
            </span>
          </span>
          <a-badge
            :count="getUnreadCount('group')"
            :overflow-count="99"
            :show-zero="false"
          />
        </button>
      </div>
    </section>

    <div class="border-b-1 border-b-solid border-color-1 px-10 py-9">
      <a-segmented
        v-model:value="activeSegment"
        block
        :options="segmentOptions"
        aria-label="联系人分类"
      >
        <template #labelRender="{ value }">
          <span class="flex items-center justify-center gap-6">
            <Icon
              :name="
                value === 'friend'
                  ? 'i-lucide:user-round'
                  : 'i-lucide:users-round'
              "
              :size="14"
            />
            <span>{{ value === 'friend' ? '好友' : '群聊' }}</span>
            <span class="text-xs opacity-65">
              {{ value === 'friend' ? contacts.length : groups.length }}
            </span>
          </span>
        </template>
      </a-segmented>
    </div>

    <div class="min-h-0 flex-1 overflow-hidden">
      <Transition name="slide-left" mode="out-in">
        <ContactList
          v-if="activeSegment === 'friend'"
          key="friend"
          class="h-full"
          :contacts="contacts"
          :friend-groups="friendGroups"
          group-mode="friendGroup"
          :search-keyword="keyword"
          :show-toolbar="false"
          :show-status-filter="false"
          @select="(contact) => emit('showContact', contact)"
          @chat="(contact) => emit('chat', contact)"
        />
        <GroupList
          v-else
          key="group"
          class="h-full"
          :groups="groups"
          :search-keyword="keyword"
          :show-toolbar="false"
          @select="(group) => emit('select', group)"
        />
      </Transition>
    </div>

    <ContactNotificationsModal
      v-model:open="notificationModalOpen"
      v-model:category="notificationCategory"
      :notifications="notifications"
      @read="emit('readNotifications', $event)"
      @resolve="handleResolveNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import ContactList from './ContactList.vue'
import ContactNotificationsModal from './ContactNotificationsModal.vue'
import GroupList from './GroupList.vue'
import Search from '../Search.vue'
import type {
  Contact,
  ContactNotification,
  ContactNotificationCategory,
  Conversation,
  FriendGroup,
} from '../types'

type ContactSegment = 'friend' | 'group'

const props = withDefaults(
  defineProps<{
    contacts?: Contact[]
    friendGroups?: FriendGroup[]
    groups?: Conversation[]
    notifications?: ContactNotification[]
  }>(),
  {
    contacts: () => [],
    friendGroups: () => [],
    groups: () => [],
    notifications: () => [],
  }
)

const emit = defineEmits<{
  select: [conversation: Conversation]
  chat: [contact: Contact]
  showContact: [contact: Contact]
  createGroup: []
  addContact: []
  openGlobalSearch: []
  readNotifications: [category: ContactNotificationCategory]
  resolveNotification: [notification: ContactNotification, accepted: boolean]
}>()

const keyword = shallowRef('')
const activeSegment = shallowRef<ContactSegment>('friend')
const notificationModalOpen = shallowRef(false)
const notificationCategory = shallowRef<ContactNotificationCategory>('friend')
const segmentOptions = [
  { value: 'friend', label: '好友' },
  { value: 'group', label: '群聊' },
]

const friendNotifications = computed(() =>
  props.notifications.filter((item) => item.category === 'friend')
)
const groupNotifications = computed(() =>
  props.notifications.filter((item) => item.category === 'group')
)
const unreadNotificationCount = computed(
  () => props.notifications.filter((item) => item.unread).length
)

function getUnreadCount(category: ContactNotificationCategory) {
  return props.notifications.filter(
    (item) => item.category === category && item.unread
  ).length
}

function openNotification(category: ContactNotificationCategory) {
  notificationCategory.value = category
  notificationModalOpen.value = true
}

function handleResolveNotification(
  notification: ContactNotification,
  accepted: boolean
) {
  emit('resolveNotification', notification, accepted)
}
</script>
