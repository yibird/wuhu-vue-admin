<template>
  <WView class="chat-page">
    <div class="h-full min-h-0 flex overflow-hidden bg-container">
      <Nav
        v-model:active-key="activeKey"
        :unread-count="totalUnreadCount"
        @open-settings="openSettingsModal"
      />
      <Sider
        :active-key="activeKey"
        :conversations="conversations"
        :contacts="contacts"
        :groups="groups"
        :resizing="isSidebarResizing"
        :style="sidebarStyle"
        v-model:active-conversation-id="activeConversationId"
        @select="handleConversationSelect"
        @chat="handleContactQuickChat"
        @show-contact="openUserDetail"
        @open-create-group="openCreateGroupModal"
        @open-add-contact="openAddContactModal"
        @delete-conversation="handleConversationDelete"
        @mute-conversation="toggleConversationMuted"
        @pin-conversation="toggleConversationPinned"
        @mark-unread="markConversationUnread"
        @archive-conversation="toggleConversationArchived"
        @open-global-search="openGlobalSearch"
        @resize-start="startSidebarResize"
      />
      <MessageArea
        :conversation="activeConversation"
        :favorite-message-ids="favoriteMessageIds"
        :messages="activeMessages"
        :typing="isCurrentConversationTyping"
        :settings="chatSettings"
        @send="handleMessageSend"
        @typing="handleTyping"
        @stop-typing="handleStopTyping"
        @retry-message="handleMessageRetry"
        @recall-message="handleMessageRecall"
        @delete-message="handleMessageDelete"
        @copy-message="handleMessageCopy"
        @toggle-favorite="toggleMessageFavorite"
        @reaction-message="handleMessageReaction"
        @preview-image="handleImagePreview"
        @download-message="handleMessageDownload"
        @show-user="openUserDetail"
        @call="handleCall"
        @toggle-pin="toggleConversationPinned"
        @toggle-mute="toggleConversationMuted"
        @clear-messages="handleMessagesClear"
        @open-group-panel="openGroupPanel"
      />
    </div>

    <CallFloatingWindow
      v-model:open="callOpen"
      :type="callType"
      :conversation="callConversation"
    />

    <UserDetailModal
      :open="userDetailOpen"
      :user="selectedUser"
      @close="closeUserDetail"
      @chat="startPrivateChat"
    />

    <SettingsModal
      v-model:open="settingsModalOpen"
      v-model:settings="chatSettings"
    />

    <GroupDrawer
      v-model:open="groupDrawerOpen"
      v-model:active-tab="groupPanelTab"
      :conversation="activeConversation"
      @show-user="openUserDetail"
      @update-announcement="updateGroupAnnouncement"
    />

    <CreateGroupModal
      v-model:open="createGroupModalOpen"
      :contacts="contacts"
      @submit="createGroup"
    />

    <AddContactOrGroupModal
      v-model:open="addContactModalOpen"
      :contacts="contacts"
      :groups="groups"
      :candidates="directoryCandidates"
      @add-user="addDirectoryUser"
      @add-group="addDirectoryGroup"
    />

    <GlobalSearchModal
      v-model:open="globalSearchOpen"
      :contacts="contacts"
      :groups="groups"
      :conversations="conversations"
      :messages-by-conversation="messagesByConversation"
      @select-contact="handleGlobalContactSelect"
      @select-group="handleGlobalGroupSelect"
      @select-message="selectGlobalMessage"
    />

    <a-modal
      v-model:open="imagePreviewOpen"
      title="图片预览"
      :footer="null"
      centered
    >
      <img
        v-if="previewImageUrl"
        :src="previewImageUrl"
        alt="聊天图片"
        class="max-h-[70vh] w-full rounded-6 object-contain"
      />
    </a-modal>
  </WView>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { Nav, Sider, MessageArea } from './components'
import CallFloatingWindow from './components/call/FloatingWindow.vue'
import AddContactOrGroupModal from './components/discovery/AddContactOrGroupModal.vue'
import CreateGroupModal from './components/discovery/CreateGroupModal.vue'
import GlobalSearchModal from './components/GlobalSearchModal.vue'
import GroupDrawer from './components/group/Drawer.vue'
import SettingsModal from './components/settings/Modal.vue'
import UserDetailModal from './components/user/DetailModal.vue'
import { useChat } from './composables/useChat'
import type {
  Contact,
  Conversation,
  GroupPanelTab,
  UserInfo,
} from './components/types'

const {
  activeKey,
  activeConversationId,
  activeConversation,
  isSidebarResizing,
  sidebarStyle,
  imagePreviewOpen,
  previewImageUrl,
  callOpen,
  callType,
  callConversation,
  chatSettings,
  conversations,
  contacts,
  groups,
  directoryCandidates,
  messagesByConversation,
  favoriteMessageIds,
  activeMessages,
  totalUnreadCount,
  isCurrentConversationTyping,
  startSidebarResize,
  handleConversationSelect,
  handleGlobalMessageSelect: selectGlobalMessage,
  handleContactChat,
  handleMessageSend,
  handleTyping,
  handleStopTyping,
  handleMessageRetry,
  handleMessageRecall,
  handleMessageDelete,
  handleMessageCopy,
  toggleMessageFavorite,
  handleMessageReaction,
  handleImagePreview,
  handleMessageDownload,
  handleCall,
  toggleConversationPinned,
  toggleConversationMuted,
  markConversationUnread,
  toggleConversationArchived,
  handleConversationDelete,
  handleMessagesClear,
  updateGroupAnnouncement,
  createGroup,
  addDirectoryUser,
  addDirectoryGroup,
} = useChat()

const selectedUser = shallowRef<UserInfo | null>(null)
const settingsModalOpen = shallowRef(false)
const createGroupModalOpen = shallowRef(false)
const addContactModalOpen = shallowRef(false)
const globalSearchOpen = shallowRef(false)
const groupDrawerOpen = shallowRef(false)
const groupPanelTab = shallowRef<GroupPanelTab>('announcement')
const userDetailOpen = computed(() => Boolean(selectedUser.value))

function openSettingsModal() {
  settingsModalOpen.value = true
}

function openCreateGroupModal() {
  createGroupModalOpen.value = true
}

function openAddContactModal() {
  addContactModalOpen.value = true
}

function openGlobalSearch() {
  globalSearchOpen.value = true
}

function openGroupPanel(tab: GroupPanelTab) {
  if (activeConversation.value?.type !== 'group') return
  groupPanelTab.value = tab
  groupDrawerOpen.value = true
}

function handleGlobalContactSelect(contact: Contact) {
  handleContactChat(contact)
}

function handleGlobalGroupSelect(group: Conversation) {
  activeKey.value = 'conversation'
  handleConversationSelect(group)
}

function openUserDetail(user: UserInfo) {
  const contact = contacts.value.find((item) => item.id === user.id)
  const conversationUser = conversations.value.find(
    (item) => item.userInfo?.id === user.id
  )?.userInfo

  selectedUser.value = {
    ...conversationUser,
    ...contact,
    ...user,
  }
}

function closeUserDetail() {
  selectedUser.value = null
}

function handleContactQuickChat(contact: Contact) {
  handleContactChat(contact, false)
}

function startPrivateChat(user: UserInfo) {
  const navigateToConversation = activeKey.value !== 'contact'
  closeUserDetail()
  groupDrawerOpen.value = false
  handleContactChat(user, navigateToConversation)
}

function handleGlobalSearchShortcut(event: KeyboardEvent) {
  if (event.defaultPrevented) return
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
    return
  }

  event.preventDefault()
  openGlobalSearch()
}

watch(
  () => activeConversation.value?.id,
  () => {
    if (activeConversation.value?.type !== 'group') {
      groupDrawerOpen.value = false
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleGlobalSearchShortcut, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalSearchShortcut, true)
})
</script>
