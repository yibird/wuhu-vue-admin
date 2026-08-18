<template>
  <div
    class="h-full flex flex-col bg-container"
    :class="{ 'settings-panel--modal': !showHeader }"
  >
    <div
      v-if="showHeader"
      class="h-60 shrink-0 flex items-center justify-between border-b-1 border-b-solid border-color-1 px-14"
    >
      <div>
        <div class="text-main font-600">聊天设置</div>
      </div>
      <Icon
        name="i-lucide:sliders-horizontal"
        :size="18"
        class="text-secondary"
      />
    </div>

    <Scrollbar
      class="min-h-0 flex-1"
      :class="{ 'settings-panel__scroll--modal': !showHeader }"
    >
      <div class="p-14">
        <section class="setting-section">
          <div class="setting-section__title">发送与阅读</div>
          <div class="setting-list">
            <label
              v-for="item in binarySettings"
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
              </span>
              <a-switch
                :checked="settings[item.key]"
                @change="updateSetting(item.key, $event)"
              />
            </label>
          </div>
        </section>

        <section class="setting-section">
          <div class="setting-section__title">会话治理</div>
          <div class="rounded-8 border-1 border-color-1 border-solid p-12">
            <div class="mb-10 flex items-center justify-between gap-12">
              <div class="min-w-0">
                <div class="text-sm text-main font-500">自动归档静默会话</div>
              </div>
              <span
                class="min-w-44 rounded-6 bg-fill-quaternary px-8 py-4 text-center text-xs text-main"
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
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import type {
  ChatSettings,
  SettingPanelEmits,
  SettingPanelProps,
} from '../types'

const props = withDefaults(defineProps<SettingPanelProps>(), {
  showHeader: true,
})
const emit = defineEmits<SettingPanelEmits>()

type BinarySettingKey = keyof Pick<
  ChatSettings,
  | 'enterToSend'
  | 'desktopNotify'
  | 'messageSound'
  | 'readReceipt'
  | 'dnd'
  | 'compactMode'
>

interface BinarySetting {
  key: BinarySettingKey
  label: string
  icon: string
  iconClass: string
}

const settings = computed(() => props.modelValue)

const binarySettings: BinarySetting[] = [
  {
    key: 'enterToSend',
    label: 'Enter 发送',
    icon: 'i-lucide:corner-down-left',
    iconClass: 'icon-primary-soft',
  },
  {
    key: 'desktopNotify',
    label: '桌面通知',
    icon: 'i-lucide:monitor-dot',
    iconClass: 'bg-info-tint text-info',
  },
  {
    key: 'messageSound',
    label: '消息提示音',
    icon: 'i-lucide:volume-2',
    iconClass: 'icon-primary-soft',
  },
  {
    key: 'readReceipt',
    label: '已读回执',
    icon: 'i-lucide:check-check',
    iconClass: 'bg-success-tint text-success',
  },
  {
    key: 'dnd',
    label: '全局免打扰',
    icon: 'i-lucide:moon',
    iconClass: 'bg-warning-tint text-warning',
  },
  {
    key: 'compactMode',
    label: '紧凑消息流',
    icon: 'i-lucide:rows-3',
    iconClass: 'bg-fill-quaternary text-secondary',
  },
]

function patchSettings(patch: Partial<ChatSettings>) {
  emit('update:modelValue', {
    ...props.modelValue,
    ...patch,
  })
}

function updateSetting(key: BinarySettingKey, checked: unknown) {
  patchSettings({ [key]: Boolean(checked) })
}

function updateArchiveDays(value: number | [number, number] | unknown) {
  const nextValue =
    typeof value === 'number'
      ? value
      : Array.isArray(value) && typeof value[0] === 'number'
        ? value[0]
        : props.modelValue.autoArchiveDays

  patchSettings({
    autoArchiveDays: nextValue,
  })
}
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
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.setting-row:hover {
  background-color: rgb(var(--w-bg-hover));
  border-color: rgb(var(--w-border-color-2));
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
</style>
