<template>
  <WView class="p-10 absolute overflow-hidden bg-page">
    <DragDropProvider>
      <div
        class="h-full min-h-0 grid grid-cols-[290px_minmax(0,1fr)_330px] gap-12 overflow-hidden max-xl:grid-cols-[250px_minmax(0,1fr)] max-xl:grid-rows-[minmax(0,1fr)_minmax(520px,330px)] max-[767px]:grid-cols-1 max-[767px]:grid-rows-[420px_minmax(0,1fr)_330px]"
      >
        <SidebarTabs
          class="low-code-designer-sidebar"
          :nodes="nodes"
          :palette="palette"
          :palette-tabs="paletteTabs"
          :selected-ids="selectedIds"
          @add="addNode"
          @add-favorite="addNode"
          @apply-template="handleApplyPageTemplate"
          @duplicate="duplicateNode"
          @move-down="moveNodeDown"
          @move-up="moveNodeUp"
          @remove="removeNode"
          @select="selectNode"
        />
        <Canvas
          :active-version-id="activeVersionId"
          :can-redo="canRedo"
          :can-undo="canUndo"
          :nodes="nodes"
          :platform="platform"
          :platform-label="activePlatform?.label ?? 'PC'"
          :platform-width="activePlatform?.width ?? 1440"
          :platforms="platforms"
          :selected-id="selectedId"
          :selected-ids="selectedIds"
          :source-panel-open="sourcePanelOpen"
          :versions="versions"
          @add-empty="addNode('card')"
          @change-platform="platform = $event"
          @change-version="restoreVersionById"
          @canvas-active-change="canvasActive = $event"
          @clear-selection="clearSelection"
          @duplicate="duplicateNode"
          @duplicate-selected="duplicateSelectedNode"
          @drop-component="addNode"
          @move-down="moveNodeDown"
          @move-node="moveNodeToTarget"
          @move-up="moveNodeUp"
          @redo="redo"
          @reorder="handleReorderNodes"
          @remove="removeNode"
          @remove-selected="removeSelectedNode"
          @save-version="saveVersion"
          @select="selectNode"
          @select-many="selectNodes"
          @toggle-source="toggleSourcePanel"
          @undo="undo"
        />
        <div
          class="low-code-designer-right min-h-0 min-w-0 grid grid-rows-[minmax(210px,0.34fr)_minmax(0,0.66fr)] gap-12 overflow-hidden max-xl:col-span-full"
        >
          <AiPanel
            v-model:prompt="aiPrompt"
            :busy="aiBusy"
            :can-update-selected="!!selectedNode"
            :messages="aiMessages"
            :suggestions="aiSuggestions"
            @apply-suggestion="applySuggestion"
            @generate="generateFromPrompt()"
            @update-selected="applyAiToSelectedNode()"
          />
          <Inspector
            class="designer-inspector min-w-0"
            :component-count="componentCount"
            :history-length="history.length"
            :node="selectedNode"
            :selected-count="selectedCount"
            :versions="versions"
            @open-versions="isVersionModalOpen = true"
            @remove="removeSelectedNode"
            @save-version="saveVersion"
            @update="updateSelectedNode"
          />
        </div>
      </div>
    </DragDropProvider>

    <SourcePanel
      :error="schemaError"
      :open="sourcePanelOpen"
      :source-code="schemaCode"
      @apply="applySchemaCode()"
      @close="closeSourcePanel"
      @copy="copySchemaCode"
      @download="downloadSchemaCode"
      @format="formatSchemaCode"
      @source-change="updateSchemaCode"
    />

    <VersionModal
      v-model:open="isVersionModalOpen"
      :versions="versions"
      @restore="handleRestoreVersion"
    />
  </WView>
</template>

<script setup lang="ts">
import { onKeyStroke, useEventListener } from '@vueuse/core'
import { DragDropProvider } from '@dnd-kit/vue'
import { AiPanel } from './components'
import { Canvas } from './components'
import { Inspector } from './components'
import { SidebarTabs } from './components'
import { SourcePanel } from './components'
import { VersionModal } from './components'
import { useLowCodeDesigner } from './composables/useDesigner'

import type { DesignerComponentType, DesignerVersion } from './types'

const {
  activePlatform,
  activeVersionId,
  aiBusy,
  aiMessages,
  aiPrompt,
  aiSuggestions,
  batchAddNodes,
  canRedo,
  canUndo,
  componentCount,
  history,
  nodes,
  palette,
  paletteTabs,
  platform,
  platforms,
  schemaCode,
  schemaError,
  selectedId,
  selectedIds,
  selectedCount,
  selectedNode,
  sourcePanelOpen,
  versions,
  addNode,
  applyAiToSelectedNode,
  applySuggestion,
  applySchemaCode,
  clearSelection,
  closeSourcePanel,
  copySchemaCode,
  downloadSchemaCode,
  duplicateNode,
  duplicateSelectedNode,
  formatSchemaCode,
  generateFromPrompt,
  moveNodeDown,
  moveNodeToTarget,
  moveNodeUp,
  redo,
  removeNode,
  removeSelectedNode,
  reorderNodes,
  restoreVersion,
  restoreVersionById,
  saveVersion,
  selectNode,
  selectNodes,
  toggleSourcePanel,
  undo,
  updateSchemaCode,
  updateSelectedNode,
} = useLowCodeDesigner()

const isVersionModalOpen = shallowRef(false)
const canvasActive = shallowRef(false)

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return !!target.closest('input, textarea, select, [contenteditable="true"]')
}

onKeyStroke(
  ['Delete', 'Backspace'],
  (event) => {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      selectedCount.value === 0 ||
      isEditableTarget(event.target)
    ) {
      return
    }

    event.preventDefault()
    removeSelectedNode()
  },
  { dedupe: true }
)

useEventListener(window, 'keydown', (event) => {
  if (
    event.defaultPrevented ||
    event.isComposing ||
    !canvasActive.value ||
    isEditableTarget(event.target)
  ) {
    return
  }

  const isCtrlOrMeta = event.ctrlKey || event.metaKey

  if (isCtrlOrMeta && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      redo()
    } else {
      undo()
    }
    return
  }

  if (
    isCtrlOrMeta &&
    event.key.toLowerCase() === 'c' &&
    selectedCount.value > 0
  ) {
    event.preventDefault()
    duplicateSelectedNode()
  }
})

function handleRestoreVersion(version: DesignerVersion) {
  restoreVersion(version)
  isVersionModalOpen.value = false
}

function handleReorderNodes(orderedIds: string[], nextSelectedId: string) {
  reorderNodes(orderedIds, nextSelectedId)
}

function handleApplyPageTemplate(components: DesignerComponentType[]) {
  batchAddNodes(components)
}
</script>
