<template>
  <WView class="chat-page">
    <div class="h-full min-h-0 flex overflow-hidden bg-container">
      <Nav
        v-model:active-key="activeKey"
        :unread-count="totalUnreadCount"
        :contact-notification-count="contactNotificationCount"
        @open-settings="openSettingsModal"
      />
      <Sider
        :active-key="activeKey"
        :conversations="conversations"
        :contacts="contacts"
        :friend-groups="friendGroups"
        :groups="groups"
        :notifications="contactNotifications"
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
        @read-notifications="markContactNotificationsRead"
        @resolve-notification="resolveContactNotification"
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
import { Nav, Sider, MessageArea } from './components'
import CallFloatingWindow from './components/call/FloatingWindow.vue'
import AddContactOrGroupModal from './components/discovery/AddContactOrGroupModal.vue'
import CreateGroupModal from './components/discovery/CreateGroupModal.vue'
import GlobalSearchModal from './components/GlobalSearchModal.vue'
import GroupDrawer from './components/group/Drawer.vue'
import SettingsModal from './components/settings/Modal.vue'
import UserDetailModal from './components/user/DetailModal.vue'
import { useChat } from './composables/useChat'
import { useChatPanels } from './composables/useChatPanels'

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
  friendGroups,
  groups,
  directoryCandidates,
  messagesByConversation,
  favoriteMessageIds,
  contactNotifications,
  activeMessages,
  totalUnreadCount,
  contactNotificationCount,
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
  markContactNotificationsRead,
  resolveContactNotification,
} = useChat()

const {
  addContactModalOpen,
  createGroupModalOpen,
  globalSearchOpen,
  groupDrawerOpen,
  groupPanelTab,
  selectedUser,
  settingsModalOpen,
  userDetailOpen,
  closeUserDetail,
  handleContactQuickChat,
  handleGlobalContactSelect,
  handleGlobalGroupSelect,
  openAddContactModal,
  openCreateGroupModal,
  openGlobalSearch,
  openGroupPanel,
  openSettingsModal,
  openUserDetail,
  startPrivateChat,
} = useChatPanels({
  activeKey,
  activeConversation,
  contacts,
  conversations,
  selectConversation: handleConversationSelect,
  startContactChat: handleContactChat,
})
</script>
