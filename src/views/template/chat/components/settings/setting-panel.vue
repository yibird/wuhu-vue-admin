<template>
  <div
    class="h-full flex flex-col bg-container"
    :class="{ 'settings-panel--modal': !showHeader }"
  >
    <div
      v-if="showHeader"
      class="h-60 shrink-0 flex items-center justify-between b-b-1-muted px-14"
    >
      <div class="text-main font-600">设置</div>
      <Icon
        name="i-lucide:sliders-horizontal"
        :size="18"
        class="text-secondary"
      />
    </div>

    <div
      class="min-h-0 flex-1 w-full h-full overflow-x-hidden overflow-y-auto"
      :class="{ 'settings-panel__scroll--modal': !showHeader }"
    >
      <div class="p-14">
        <section
          v-for="section in settingSections"
          :key="section.key"
          class="setting-section"
        >
          <div class="setting-section__title">{{ section.title }}</div>
          <div class="setting-list">
            <label
              v-for="item in section.items"
              :key="item.key"
              class="setting-row"
            >
              <span class="setting-row__icon" :class="item.iconClass">
                <Icon :name="item.icon" :size="17" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm text-main font-500">{{
                  item.label
                }}</span>
                <span class="mt-2 block text-xs text-secondary">{{
                  item.description
                }}</span>
              </span>
              <a-switch
                :checked="settings[item.key]"
                @change="updateSetting(item.key, $event)"
              />
            </label>

            <div
              v-if="section.key === 'notify' && settings.messageSound"
              class="setting-volume"
            >
              <div class="mb-6 flex items-center justify-between gap-12">
                <span class="text-sm text-main font-500">提示音音量</span>
                <span class="text-xs text-secondary"
                  >{{ settings.soundVolume }}%</span
                >
              </div>
              <div class="flex items-center gap-10">
                <a-slider
                  class="min-w-0 flex-1"
                  :value="settings.soundVolume"
                  :min="0"
                  :max="100"
                  :step="5"
                  @change="updateSoundVolume"
                />
                <a-button size="small" @click="emits('previewSound')">
                  <template #icon>
                    <Icon name="i-lucide:play" :size="13" />
                  </template>
                  试听
                </a-button>
              </div>
            </div>
          </div>
        </section>

        <section class="setting-section">
          <div class="setting-section__title">会话管理</div>
          <div class="rounded-8 b-1-muted p-12">
            <div class="mb-10 flex items-center justify-between gap-12">
              <div class="min-w-0">
                <div class="text-sm text-main font-500">自动归档静默会话</div>
                <div class="mt-2 text-xs text-secondary">
                  超过设定天数没有新消息的会话将自动归档
                </div>
              </div>
              <span
                class="min-w-44 rounded-6 bg-secondary px-8 py-4 text-center text-xs text-main"
              >
                {{ settings.autoArchiveDays }} 天
              </span>
            </div>
            <a-slider
              :value="settings.autoArchiveDays"
              :min="7"
              :max="90"
              :step="7"
              @change="updateArchiveDays"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import { settingSections } from './data'
import { useChatSettings } from './hooks'
import type { SettingPanelEmits, SettingPanelProps } from '../types'

const props = withDefaults(defineProps<SettingPanelProps>(), {
  showHeader: true,
})
const emits = defineEmits<SettingPanelEmits>()

const { settings, updateSetting, updateSoundVolume, updateArchiveDays } =
  useChatSettings({
    settings: () => props.modelValue,
    onChange: (value) => emits('update:modelValue', value),
  })
</script>

<style scoped>
.setting-section {
  margin-bottom: 18px;
}

.settings-panel__scroll--modal {
  max-height: 55vh;
}

.setting-section__title {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--w-text-secondary));
}

.setting-list {
  display: grid;
  gap: 8px;
}

.setting-row {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border: 1px solid rgb(var(--w-border-muted));
  border-radius: 8px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.setting-row:hover {
  background-color: rgb(var(--w-bg-hover));
  border-color: rgb(var(--w-border-regular));
}

.setting-row__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
}

.setting-volume {
  padding: 10px 10px 4px;
  border: 1px solid rgb(var(--w-border-muted));
  border-radius: 8px;
}
</style>
