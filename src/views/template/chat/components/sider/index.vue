<template>
  <aside
    class="chat-sidebar relative h-full shrink-0 border-r-1 border-r-solid border-color-1 bg-container"
    :class="{ 'is-resizing': resizing }"
  >
    <Transition name="sidebar-view" mode="out-in">
      <ConversationList
        v-if="activeKey === 'conversation'"
        key="conversation"
        :conversations="conversations"
        :active-conversation-id="activeConversationId"
        @select="handleConversationSelect"
        @create-group="emit('open-create-group')"
        @add-contact="emit('open-add-contact')"
        @open-global-search="emit('open-global-search')"
        @delete="(conversation) => emit('delete-conversation', conversation)"
        @mute="(conversation) => emit('mute-conversation', conversation)"
        @pin="(conversation) => emit('pin-conversation', conversation)"
        @mark-unread="(conversation) => emit('mark-unread', conversation)"
        @archive="(conversation) => emit('archive-conversation', conversation)"
      />
      <ContactList
        v-else-if="activeKey === 'contact'"
        key="contact"
        :contacts="contacts"
        @select="(contact) => emit('show-contact', contact)"
        @chat="handleContactChat"
        @create-group="emit('open-create-group')"
        @add-contact="emit('open-add-contact')"
        @open-global-search="emit('open-global-search')"
      />
      <ContactCenter
        v-else-if="activeKey === 'contactCenter'"
        key="contact-center"
        :contacts="contacts"
        :friend-groups="friendGroups"
        :groups="groups"
        :notifications="notifications"
        @select="handleConversationSelect"
        @chat="handleContactChat"
        @show-contact="(contact) => emit('show-contact', contact)"
        @create-group="emit('open-create-group')"
        @add-contact="emit('open-add-contact')"
        @open-global-search="emit('open-global-search')"
        @read-notifications="(category) => emit('read-notifications', category)"
        @resolve-notification="
          (notification, accepted) =>
            emit('resolve-notification', notification, accepted)
        "
      />
    </Transition>
    <button
      type="button"
      class="chat-sidebar-resize-handle"
      :class="{ 'is-active': resizing }"
      aria-label="调整侧边栏宽度"
      title="拖拽调整侧边栏宽度"
      @pointerdown="$emit('resize-start', $event)"
    />
  </aside>
</template>

<script lang="ts" setup>
import ConversationList from './ConversationList.vue'
import ContactList from './ContactList.vue'
import ContactCenter from './ContactCenter.vue'
import type {
  Contact,
  ContactNotification,
  ContactNotificationCategory,
  Conversation,
  FriendGroup,
  NavType,
} from '../types'

withDefaults(
  defineProps<{
    activeKey?: NavType
    conversations?: Conversation[]
    contacts?: Contact[]
    friendGroups?: FriendGroup[]
    groups?: Conversation[]
    notifications?: ContactNotification[]
    resizing?: boolean
  }>(),
  {
    activeKey: 'conversation',
    conversations: () => [],
    contacts: () => [],
    friendGroups: () => [],
    groups: () => [],
    notifications: () => [],
    resizing: false,
  }
)

const emit = defineEmits<{
  select: [conversation: Conversation]
  chat: [contact: Contact]
  'show-contact': [contact: Contact]
  'open-create-group': []
  'open-add-contact': []
  'open-global-search': []
  'delete-conversation': [conversation: Conversation]
  'mute-conversation': [conversation: Conversation]
  'pin-conversation': [conversation: Conversation]
  'mark-unread': [conversation: Conversation]
  'archive-conversation': [conversation: Conversation]
  'read-notifications': [category: ContactNotificationCategory]
  'resolve-notification': [notification: ContactNotification, accepted: boolean]
  'resize-start': [event: PointerEvent]
}>()

const activeConversationId = defineModel<string>('activeConversationId', {
  default: '',
})
function handleConversationSelect(conversation: Conversation) {
  activeConversationId.value = conversation.id
  emit('select', conversation)
}

function handleContactChat(contact: Contact) {
  emit('chat', contact)
}
</script>

<style scoped>
.chat-sidebar {
  min-width: 260px;
  max-width: 440px;
}

.sidebar-view-enter-active,
.sidebar-view-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-moderate) var(--w-motion-ease-enter);
}

.sidebar-view-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.sidebar-view-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.chat-sidebar-resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  z-index: 5;
  width: 8px;
  height: 100%;
  padding: 0;
  cursor: col-resize;
  background: transparent;
  border: 0;
}

.chat-sidebar-resize-handle::before {
  position: absolute;
  top: 12px;
  right: 3px;
  bottom: 12px;
  width: 2px;
  content: '';
  background: transparent;
  border-radius: 999px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.chat-sidebar-resize-handle:hover::before,
.chat-sidebar-resize-handle.is-active::before,
.chat-sidebar.is-resizing .chat-sidebar-resize-handle::before {
  background: rgb(var(--w-color-primary));
  box-shadow: 0 0 0 3px rgb(var(--w-color-primary) / 12%);
}

:global(body.chat-sidebar-resizing),
:global(body.chat-sidebar-resizing *) {
  cursor: col-resize !important;
  user-select: none !important;
}

@media (width <= 900px) {
  .chat-sidebar {
    width: 260px !important;
    min-width: 260px;
  }

  .chat-sidebar-resize-handle {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-view-enter-active,
  .sidebar-view-leave-active {
    transition-duration: 1ms;
  }
}
</style>
