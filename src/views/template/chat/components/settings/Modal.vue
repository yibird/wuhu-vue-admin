<template>
  <a-modal
    v-model:open="open"
    centered
    :destroy-on-hidden="true"
    :footer="null"
    :width="560"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="flex items-center gap-10">
        <span class="settings-modal__title-icon">
          <Icon name="i-lucide:settings-2" :size="18" />
        </span>
        <span>
          <span class="block text-lg text-main font-600">聊天设置</span>
          <span class="mt-2 block text-xs text-secondary font-400">
            管理消息、通知和会话偏好
          </span>
        </span>
      </div>
    </template>

    <SettingPanel v-model="draftSettings" :show-header="false" />

    <div class="settings-modal__footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleSave">保存设置</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import SettingPanel from '../sider/SettingPanel.vue'
import type { ChatSettings } from '../types'

const open = defineModel<boolean>('open', { default: false })
const settings = defineModel<ChatSettings>('settings', { required: true })

const draftSettings = shallowRef<ChatSettings>({ ...settings.value })

watch(open, (isOpen) => {
  if (isOpen) {
    draftSettings.value = { ...settings.value }
  }
})

function handleCancel() {
  open.value = false
}

function handleSave() {
  settings.value = { ...draftSettings.value }
  open.value = false
}
</script>

<style scoped>
.settings-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 12%);
  border-radius: 10px;
}

.settings-modal__footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
}
</style>
