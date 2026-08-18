<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useDesignerPreview } from '../composables/usePreview'
import { usePreviewStageScale } from '../composables/usePreviewStageScale'
import DesignerPreviewSurface from './PreviewSurface.vue'
import type {
  DesignerNode,
  DesignerPlatform,
  DesignerPlatformOption,
  DesignerPreviewMode,
} from '../types'

const props = defineProps<{
  nodes: DesignerNode[]
  open: boolean
  platform: DesignerPlatform
  platforms: DesignerPlatformOption[]
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
}>()

const nodesRef = toRef(props, 'nodes')
const openRef = toRef(props, 'open')
const platformRef = toRef(props, 'platform')
const platformsRef = toRef(props, 'platforms')

const {
  customSizeOptions,
  customSizeValue,
  isCustomMode,
  isFullscreen,
  modalClassName,
  modalWidth,
  previewMode,
  previewModeLabel,
  previewModeOptions,
  previewSize,
  previewSizeText,
  copyPreviewConfig,
  copyPreviewLink,
  sharePreview,
  selectCustomSize,
  setPreviewMode,
  toggleFullscreen,
} = useDesignerPreview({
  nodes: nodesRef,
  open: openRef,
  platform: platformRef,
  platforms: platformsRef,
})

const surfaceTitle = computed(
  () => `${previewModeLabel.value} Preview · ${previewSizeText.value}`
)

const { surfaceScaleStyle, viewportStyle } = usePreviewStageScale({
  size: previewSize,
})

function handlePreviewModeChange(value: string | number) {
  setPreviewMode(value as DesignerPreviewMode)
}
</script>

<template>
  <a-modal
    :open="open"
    :width="modalWidth"
    :footer="null"
    :centered="!isFullscreen"
    :closable="!isFullscreen"
    :destroy-on-hidden="false"
    :wrap-class-name="modalClassName"
    @update:open="$emit('update:open', $event)"
  >
    <template #title>
      <div class="flex items-center gap-8">
        <span
          class="size-30 inline-flex shrink-0 items-center justify-center rounded-8 icon-primary-soft"
        >
          <Icon name="i-lucide:scan-eye" :size="16" />
        </span>
        <div class="min-w-0">
          <div class="text-sm text-main font-700">页面预览</div>
          <div class="text-11px text-secondary">
            {{ previewModeLabel }} · {{ previewSizeText }}
          </div>
        </div>
      </div>
    </template>

    <section class="low-code-preview-panel">
      <div class="low-code-preview-toolbar">
        <div class="min-w-0 flex flex-wrap items-center gap-8">
          <a-segmented
            :value="previewMode"
            :options="previewModeOptions"
            class="low-code-preview-segmented"
            @change="handlePreviewModeChange"
          >
            <template #labelRender="payload">
              <span class="inline-flex items-center gap-5">
                <Icon :name="payload.iconName" :size="15" />
                <span>{{ payload.label }}</span>
              </span>
            </template>
          </a-segmented>

          <div
            v-if="isCustomMode"
            class="flex items-center gap-6 rounded-8 border-1 border-color-2 border-solid bg-main px-8 py-5"
          >
            <Icon name="i-lucide:ruler" :size="14" class="text-secondary" />
            <a-select
              :value="customSizeValue"
              :options="customSizeOptions"
              size="small"
              class="low-code-preview-size-select"
              @change="selectCustomSize"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <a-tooltip title="复制分享信息">
            <button
              type="button"
              class="low-code-preview-icon-button"
              aria-label="复制分享信息"
              @click="copyPreviewLink"
            >
              <Icon name="i-lucide:link" :size="16" />
            </button>
          </a-tooltip>
          <a-tooltip title="复制预览配置">
            <button
              type="button"
              class="low-code-preview-icon-button"
              aria-label="复制预览配置"
              @click="copyPreviewConfig"
            >
              <Icon name="i-lucide:braces" :size="16" />
            </button>
          </a-tooltip>
          <a-tooltip title="分享">
            <button
              type="button"
              class="low-code-preview-icon-button"
              aria-label="分享"
              @click="sharePreview"
            >
              <Icon name="i-lucide:share-2" :size="16" />
            </button>
          </a-tooltip>
          <a-tooltip :title="isFullscreen ? '退出全屏预览' : '全屏预览'">
            <button
              type="button"
              class="low-code-preview-icon-button"
              :aria-label="isFullscreen ? '退出全屏预览' : '全屏预览'"
              @click="toggleFullscreen"
            >
              <Icon
                :name="
                  isFullscreen ? 'i-lucide:minimize-2' : 'i-lucide:maximize-2'
                "
                :size="16"
              />
            </button>
          </a-tooltip>
          <a-tooltip title="关闭">
            <button
              type="button"
              class="low-code-preview-icon-button"
              aria-label="关闭预览"
              @click="$emit('update:open', false)"
            >
              <Icon name="i-lucide:x" :size="16" />
            </button>
          </a-tooltip>
        </div>
      </div>

      <div ref="previewStage" class="low-code-preview-stage">
        <div class="low-code-preview-viewport" :style="viewportStyle">
          <DesignerPreviewSurface
            :nodes="nodes"
            :scale-style="surfaceScaleStyle"
            :size="previewSize"
            :title="surfaceTitle"
          />
        </div>
      </div>
    </section>
  </a-modal>
</template>

<style scoped>
.low-code-preview-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: min(76vh, 820px);
  overflow: hidden;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.low-code-preview-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-container));
  border-bottom: 1px solid rgb(var(--w-border-color-2));
}

.low-code-preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 18px;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 20% 10%,
      rgb(var(--w-color-primary) / 10%),
      transparent 28%
    ),
    linear-gradient(rgb(var(--w-border-color-1)) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--w-border-color-1)) 1px, transparent 1px),
    rgb(var(--w-bg-page));
  background-size:
    auto,
    28px 28px,
    28px 28px,
    auto;
}

.low-code-preview-viewport {
  position: relative;
  flex-shrink: 0;
  transition:
    width var(--w-motion-duration-base) var(--w-motion-ease-standard),
    height var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.low-code-preview-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: rgb(var(--w-text-regular));
  cursor: pointer;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 6px;
  transition:
    color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.low-code-preview-icon-button:hover {
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 8%);
  border-color: rgb(var(--w-color-primary) / 40%);
}

.low-code-preview-size-select {
  width: 136px;
}

:global(.low-code-preview-modal .ant-modal-content) {
  padding: 14px;
}

:global(.low-code-preview-modal--fullscreen .ant-modal) {
  top: 0;
  max-width: none;
  height: 100vh;
  padding-bottom: 0;
  margin: 0;
}

:global(.low-code-preview-modal--fullscreen) {
  overflow: hidden;
}

:global(.low-code-preview-modal--fullscreen .ant-modal-content) {
  height: 100vh;
  border-radius: 0;
}

:global(.low-code-preview-modal--fullscreen .ant-modal-body) {
  height: calc(100vh - 58px);
}

:global(.low-code-preview-modal--fullscreen .low-code-preview-panel) {
  height: 100%;
  min-height: 100%;
  border-radius: 0;
}

@media (width <= 767px) {
  .low-code-preview-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .low-code-preview-stage {
    padding: 12px;
  }

  .low-code-preview-size-select {
    width: 128px;
  }
}
</style>
