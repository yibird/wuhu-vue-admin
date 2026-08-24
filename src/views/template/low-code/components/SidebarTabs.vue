<script setup lang="ts">
import Palette from './Palette.vue'
import StructurePanel from './StructurePanel.vue'
import type {
  DesignerComponentType,
  DesignerNode,
  DesignerPaletteItem,
  DesignerPaletteTab,
} from '../types'

defineProps<{
  nodes: DesignerNode[]
  palette: DesignerPaletteItem[]
  paletteTabs: DesignerPaletteTab[]
  selectedIds: string[]
}>()

defineEmits<{
  add: [type: DesignerComponentType]
  addFavorite: [type: DesignerComponentType]
  applyTemplate: [components: DesignerComponentType[]]
  duplicate: [id: string]
  moveDown: [id: string]
  moveUp: [id: string]
  remove: [id: string]
  select: [id: string]
}>()

const activeKey = shallowRef<'palette' | 'structure'>('palette')
</script>

<template>
  <aside
    class="designer-sidebar-tabs min-h-0 min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-elevated)]"
  >
    <a-tabs v-model:active-key="activeKey" class="h-full" size="small">
      <a-tab-pane key="palette">
        <template #tab>
          <span class="inline-flex items-center gap-6">
            <Icon name="i-lucide:blocks" :size="14" />
            <span>组件素材</span>
          </span>
        </template>
        <Palette
          embedded
          :palette="palette"
          :tabs="paletteTabs"
          @add="$emit('add', $event)"
        />
      </a-tab-pane>

      <a-tab-pane key="structure">
        <template #tab>
          <span class="inline-flex items-center gap-6">
            <Icon name="i-lucide:layers-3" :size="14" />
            <span>页面结构</span>
          </span>
        </template>
        <StructurePanel
          embedded
          :nodes="nodes"
          :selected-ids="selectedIds"
          @add-favorite="$emit('addFavorite', $event)"
          @apply-template="$emit('applyTemplate', $event)"
          @duplicate="$emit('duplicate', $event)"
          @move-down="$emit('moveDown', $event)"
          @move-up="$emit('moveUp', $event)"
          @remove="$emit('remove', $event)"
          @select="$emit('select', $event)"
        />
      </a-tab-pane>
    </a-tabs>
  </aside>
</template>

<style scoped lang="less">
.designer-sidebar-tabs {
  :deep(.ant-tabs) {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    min-height: 0;
  }

  :deep(.ant-tabs-nav) {
    padding: 8px 12px 0;
    margin: 0;
    border-bottom: 1px solid rgb(var(--w-border-color-2));
  }

  :deep(.ant-tabs-content-holder),
  :deep(.ant-tabs-content),
  :deep(.ant-tabs-tabpane) {
    height: 100%;
    min-height: 0;
  }

  :deep(.ant-tabs-tabpane) {
    overflow: hidden;
  }
}
</style>
