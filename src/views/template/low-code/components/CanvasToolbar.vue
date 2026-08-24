<script setup lang="ts">
import type {
  DesignerPlatform,
  DesignerPlatformOption,
  DesignerVersion,
} from '../types'

const props = defineProps<{
  activeVersionId: string
  canRedo: boolean
  canUndo: boolean
  isPreviewFullscreen: boolean
  platform: DesignerPlatform
  platforms: DesignerPlatformOption[]
  sourcePanelOpen: boolean
  versions: DesignerVersion[]
}>()

const emit = defineEmits<{
  'change-version': [versionId: string]
  'change-platform': [platform: DesignerPlatform]
  'enter-fullscreen': []
  'exit-fullscreen': []
  preview: []
  redo: []
  'save-version': []
  'toggle-source': []
  undo: []
}>()

const versionOptions = computed(() =>
  props.versions.map((version) => ({
    label: `${version.name} · ${version.time}`,
    value: version.id,
  }))
)

function handleVersionChange(value: string | number) {
  emit('change-version', String(value))
}
</script>

<template>
  <header
    class="flex items-center justify-between gap-10 border-0 border-b-1 border-color-2 border-b-solid px-14 py-12 max-md:flex-col max-md:items-start"
  >
    <div class="flex flex-wrap items-center gap-8">
      <button
        v-for="item in platforms"
        :key="item.value"
        type="button"
        :class="[
          'inline-flex h-32 items-center gap-6 rounded-6 border-1 border-solid px-10 text-sm cursor-pointer transition',
          platform === item.value
            ? 'border-color-primary bg-primary-tint text-primary'
            : 'border-color-2 bg-main text-regular hover:bg-hover',
        ]"
        @click="$emit('change-platform', item.value)"
      >
        <Icon :name="item.icon" :size="15" />
        {{ item.label }}
      </button>
    </div>
    <div
      class="flex flex-wrap items-center justify-end gap-8 max-md:w-full max-md:justify-start"
    >
      <a-button
        aria-label="撤回"
        :disabled="!canUndo"
        class="low-code-toolbar-icon-button"
        title="撤回"
        @click="$emit('undo')"
      >
        <template #icon>
          <Icon name="i-lucide:undo-2" :size="16" />
        </template>
      </a-button>
      <a-button
        aria-label="前进"
        :disabled="!canRedo"
        class="low-code-toolbar-icon-button"
        title="前进"
        @click="$emit('redo')"
      >
        <template #icon>
          <Icon name="i-lucide:redo-2" :size="16" />
        </template>
      </a-button>
      <a-button type="primary" @click="$emit('save-version')">
        保存版本
      </a-button>
      <a-select
        :value="activeVersionId"
        :options="versionOptions"
        class="low-code-version-select"
        @change="handleVersionChange"
      />
      <a-button
        :class="sourcePanelOpen ? 'border-primary text-primary' : ''"
        @click="$emit('toggle-source')"
      >
        <template #icon>
          <Icon name="i-lucide:code-2" />
        </template>
        源码
      </a-button>
      <a-tooltip title="页面预览">
        <button
          type="button"
          data-low-code-preview-action
          aria-label="页面预览"
          title="页面预览"
          class="inline-flex size-32 items-center justify-center rounded-6 border-1 border-color-2 border-solid bg-main text-regular cursor-pointer transition-colors hover:(bg-hover text-main)"
          @click.stop="$emit('preview')"
        >
          <Icon name="i-lucide:scan-eye" :size="16" />
        </button>
      </a-tooltip>
      <a-tooltip :title="isPreviewFullscreen ? '退出全屏预览' : '全屏预览'">
        <button
          type="button"
          data-low-code-fullscreen-action="enter"
          :aria-label="isPreviewFullscreen ? '退出全屏预览' : '全屏预览'"
          :title="isPreviewFullscreen ? '退出全屏预览' : '全屏预览'"
          class="inline-flex size-32 items-center justify-center rounded-6 border-1 border-color-2 border-solid bg-main text-regular cursor-pointer transition-colors hover:(bg-hover text-main)"
          @click.stop="
            isPreviewFullscreen
              ? $emit('exit-fullscreen')
              : $emit('enter-fullscreen')
          "
        >
          <Icon
            :name="
              isPreviewFullscreen
                ? 'i-lucide:minimize-2'
                : 'i-lucide:maximize-2'
            "
            :size="16"
          />
        </button>
      </a-tooltip>
    </div>
  </header>
</template>

<style scoped>
.low-code-version-select {
  flex-shrink: 0;
  width: 198px;
  max-width: 100%;
}

.low-code-toolbar-icon-button {
  width: 32px;
  padding-inline: 0;
}

@media (width <= 767px) {
  .low-code-version-select {
    width: min(100%, 220px);
  }
}
</style>
