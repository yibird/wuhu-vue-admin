<script setup lang="ts">
import { Main, Sider } from './components'
import { useAgent } from './composables/useAgent'

const {
  activeChat,
  activeChatId,
  activeMessages,
  activeModel,
  chats,
  draftAttachments,
  generationConfig,
  models,
  presets,
  tools,
  handleAddAttachments,
  handleArchiveChat,
  handleChatChange,
  handleClearMessages,
  handleContinueGeneration,
  handleCopyCode,
  handleCopyMessage,
  handleCopyShare,
  handleCreateChat,
  handleDeleteChat,
  handleDeleteMessage,
  handleEditMessage,
  handleFeedbackMessage,
  handleOptimizePrompt,
  handlePinChat,
  handleRegenerate,
  handleRemoveAttachment,
  handleRenameChat,
  handleSelectModel,
  handleSend,
  handleShareMessage,
  handleStop,
  handleToggleTool,
  handleUpdateConfig,
} = useAgent()
</script>

<template>
  <WView full :padding="false" class="bg-page">
    <div class="box-border h-full min-h-full min-w-0 bg-page p-10 max-md:p-8">
      <div
        class="h-full min-h-0 min-w-0 flex overflow-hidden rounded-8 border-1 border-color-1 border-solid bg-container shadow-b-sm max-xl:flex-col"
      >
        <Sider
          :items="chats"
          :active-id="activeChatId"
          @archive="handleArchiveChat"
          @change="handleChatChange"
          @create="handleCreateChat"
          @delete="handleDeleteChat"
          @pin="handlePinChat"
          @rename="handleRenameChat"
        />

        <Main
          :attachments="draftAttachments"
          :chat="activeChat"
          :config="generationConfig"
          :messages="activeMessages"
          :model="activeModel"
          :models="models"
          :presets="presets"
          :tools="tools"
          @add-attachments="handleAddAttachments"
          @clear-messages="handleClearMessages"
          @continue-generation="handleContinueGeneration"
          @copy-code="handleCopyCode"
          @copy-message="handleCopyMessage"
          @copy-share="handleCopyShare"
          @delete-message="handleDeleteMessage"
          @edit-message="handleEditMessage"
          @feedback-message="handleFeedbackMessage"
          @optimize-prompt="handleOptimizePrompt"
          @regenerate="handleRegenerate"
          @remove-attachment="handleRemoveAttachment"
          @select-model="handleSelectModel"
          @send="handleSend"
          @share-message="handleShareMessage"
          @stop="handleStop"
          @toggle-tool="handleToggleTool"
          @update-config="handleUpdateConfig"
        />
      </div>
    </div>
  </WView>
</template>
