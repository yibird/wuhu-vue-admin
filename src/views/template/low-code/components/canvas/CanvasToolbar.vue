<template>
  <div class="flex w-full items-center gap-4">
    <!-- 视图控制 -->
    <div
      class="flex-y-center gap-4 rounded-8 border-1 border-color-2 border-solid bg-elevated px-6 py-4 shadow-elevated"
    >
      <a-tooltip title="缩小 (Ctrl+滚轮)">
        <button class="lc-toolbar-btn" type="button" @click="view.zoomOut()">
          <Icon name="i-lucide:minus" :size="14" />
        </button>
      </a-tooltip>
      <a-tooltip title="恢复 100%">
        <button
          class="lc-toolbar-btn min-w-44 text-xs"
          type="button"
          @click="view.resetZoom()"
        >
          {{ Math.round(view.zoom.value * 100) }}%
        </button>
      </a-tooltip>
      <a-tooltip title="放大">
        <button class="lc-toolbar-btn" type="button" @click="view.zoomIn()">
          <Icon name="i-lucide:plus" :size="14" />
        </button>
      </a-tooltip>

      <span class="lc-toolbar-divider" />

      <a-tooltip title="适应画布">
        <button class="lc-toolbar-btn" type="button" @click="view.fit()">
          <Icon name="i-lucide:maximize" :size="14" />
        </button>
      </a-tooltip>
      <a-tooltip :title="view.showRulers.value ? '隐藏标尺' : '显示标尺'">
        <button
          class="lc-toolbar-btn"
          :class="{ 'is-active': view.showRulers.value }"
          type="button"
          @click="view.showRulers.value = !view.showRulers.value"
        >
          <Icon name="i-lucide:ruler" :size="14" />
        </button>
      </a-tooltip>
      <a-tooltip :title="view.showGrid.value ? '隐藏网格' : '显示网格'">
        <button
          class="lc-toolbar-btn"
          :class="{ 'is-active': view.showGrid.value }"
          type="button"
          @click="view.showGrid.value = !view.showGrid.value"
        >
          <Icon name="i-lucide:grid-3x3" :size="14" />
        </button>
      </a-tooltip>

      <span class="lc-toolbar-divider" />

      <a-tooltip :title="fullscreen ? '退出全屏' : '全屏设计'">
        <button
          class="lc-toolbar-btn"
          :class="{ 'is-active': fullscreen }"
          type="button"
          @click="emit('toggle-fullscreen')"
        >
          <Icon
            :name="fullscreen ? 'i-lucide:minimize' : 'i-lucide:expand'"
            :size="14"
          />
        </button>
      </a-tooltip>
    </div>

    <!-- 右侧：选中状态 + 设备尺寸（Chrome 移动端调试风格） -->
    <div class="ml-auto flex-y-center gap-8">
      <span v-if="selectedCount" class="text-xs text-primary">
        已选中 {{ selectedCount }} 个组件
      </span>
      <div
        class="flex-y-center gap-4 rounded-8 border-1 border-color-2 border-solid bg-elevated px-6 py-4 shadow-elevated"
      >
        <a-select
          :value="designer.previewDevice.value"
          class="w-104px"
          :options="deviceOptions"
          @change="designer.setDevice($event as never)"
        />
        <a-input-number
          :value="deviceSize.width"
          class="w-76px"
          :controls="false"
          :min="240"
          :max="4000"
          @change="
            (value: number | null) =>
              onSizeChange({ width: value ?? undefined })
          "
        />
        <span class="text-xs text-muted">×</span>
        <a-input-number
          :value="deviceSize.height"
          class="w-76px"
          :controls="false"
          :min="240"
          :max="4000"
          @change="
            (value: number | null) =>
              onSizeChange({ height: value ?? undefined })
          "
        />
        <a-tooltip title="横竖屏切换">
          <button
            class="lc-toolbar-btn"
            type="button"
            @click="designer.rotateDevice()"
          >
            <Icon name="i-lucide:rotate-cw" :size="14" />
          </button>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components'
import { useDesignerContext } from '../../composables'
import { DEVICE_PRESETS } from '../../types'
import type { CanvasViewApi } from '../../composables'

defineProps<{ view: CanvasViewApi; fullscreen: boolean }>()
const emit = defineEmits<{ 'toggle-fullscreen': [] }>()

const designer = useDesignerContext()
const deviceSize = computed(() => designer.deviceSize.value)
const selectedCount = computed(() => designer.selectedIds.value.length)

const deviceOptions = computed(() =>
  DEVICE_PRESETS.map((preset) => ({
    label:
      preset.value === 'custom'
        ? '自定义'
        : `${preset.label} ${preset.width}×${preset.height}`,
    value: preset.value,
  }))
)

function onSizeChange(patch: { width?: number; height?: number }) {
  if (patch.width === undefined && patch.height === undefined) return
  designer.setDeviceSize(patch)
}
</script>

<style scoped lang="less">
.lc-toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 5px;

  &:hover {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 8%);
  }

  &.is-active {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 10%);
  }
}

.lc-toolbar-divider {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: rgb(var(--w-border-color-2));
}
</style>
