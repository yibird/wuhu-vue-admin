<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {
  Canvas as WorkflowCanvas,
  ContextMenu as WorkflowContextMenu,
  Header as WorkflowHeader,
  Inspector as WorkflowInspector,
  SourcePanel as WorkflowSourcePanel,
} from '../components'
import { workflowPalette } from '../data'
import { useWorkflowDesigner } from '../composables/useDesigner'
import { findWorkflowDefinition } from '../management/data'

const route = useRoute()
const workflowId =
  typeof route.query.workflowId === 'string'
    ? route.query.workflowId
    : undefined
const definition = findWorkflowDefinition(workflowId)
const initialTitle =
  route.query.mode === 'create' ? '未命名流程' : definition?.name

const {
  canRedo,
  canRemoveSelected,
  canUndo,
  contextActions,
  contextMenu,
  defaultEdgeOptions,
  edges,
  fitView,
  isRunning,
  nodes,
  nodesLocked,
  runLogs,
  schemaError,
  selectedNodeData,
  selectedNodeId,
  selectedTestCaseId,
  sourceCode,
  sourcePanelOpen,
  testCases,
  workflowSchema,
  zoomIn,
  zoomOut,
  addNode,
  arrangeNodes,
  applySourceCode,
  clearSelectedNode,
  closeContextMenu,
  closeSourcePanel,
  copyWorkflowSchema,
  downloadWorkflowSchema,
  formatSourceCode,
  handleConnect,
  handleContextAction,
  handleNodeClick,
  handleNodeDragStart,
  handleNodeDragStop,
  handleSourceCodeChange,
  openEdgeContextMenu,
  openNodeContextMenu,
  openPaneContextMenu,
  removeSelectedNode,
  runWorkflow,
  selectTestCase,
  toggleNodesLocked,
  toggleSourcePanel,
  updateSelectedConfig,
  updateSelectedData,
  redoWorkflow,
  undoWorkflow,
} = useWorkflowDesigner({ initialTitle })
</script>

<template>
  <div
    class="h-full min-h-0 flex flex-col gap-10 overflow-hidden bg-page p-10 max-sm:p-8"
  >
    <WorkflowHeader
      class="flex-none"
      :edges-count="edges.length"
      :is-running="isRunning"
      :nodes-count="nodes.length"
      :source-panel-open="sourcePanelOpen"
      :title="workflowSchema.title"
      @copy-schema="copyWorkflowSchema"
      @download-schema="downloadWorkflowSchema"
      @fit-view="fitView()"
      @run="runWorkflow"
      @toggle-source="toggleSourcePanel"
    />

    <div class="relative min-h-0 min-w-0 flex-1 overflow-hidden">
      <WorkflowCanvas
        v-model:nodes="nodes"
        v-model:edges="edges"
        :can-redo="canRedo"
        :can-remove-selected="canRemoveSelected"
        :can-undo="canUndo"
        :default-edge-options="defaultEdgeOptions"
        :is-running="isRunning"
        :nodes-locked="nodesLocked"
        :palette="workflowPalette"
        :run-logs="runLogs"
        :selected-test-case-id="selectedTestCaseId"
        :test-cases="testCases"
        @add-node="addNode"
        @arrange-nodes="arrangeNodes"
        @connect="handleConnect"
        @edge-context-menu="openEdgeContextMenu"
        @fit-view="fitView()"
        @node-click="handleNodeClick"
        @node-context-menu="openNodeContextMenu"
        @node-drag-start="handleNodeDragStart"
        @node-drag-stop="handleNodeDragStop"
        @pane-click="clearSelectedNode"
        @pane-context-menu="openPaneContextMenu"
        @remove-selected="removeSelectedNode"
        @redo="redoWorkflow"
        @run="runWorkflow"
        @select-test-case="selectTestCase"
        @toggle-nodes-locked="toggleNodesLocked"
        @undo="undoWorkflow"
        @zoom-in="zoomIn()"
        @zoom-out="zoomOut()"
      />

      <WorkflowSourcePanel
        :error="schemaError"
        :open="sourcePanelOpen"
        :source-code="sourceCode"
        @apply="applySourceCode()"
        @close="closeSourcePanel"
        @copy="copyWorkflowSchema"
        @download="downloadWorkflowSchema"
        @format="formatSourceCode"
        @source-change="handleSourceCodeChange"
      />

      <Transition name="slide-right">
        <WorkflowInspector
          v-if="selectedNodeData"
          class="absolute bottom-12 right-12 top-60 z-20 w-360 max-w-[calc(100%-24px)]"
          :selected-node-data="selectedNodeData"
          :selected-node-id="selectedNodeId"
          @close="clearSelectedNode"
          @remove-selected="removeSelectedNode"
          @update-config="updateSelectedConfig"
          @update-data="updateSelectedData"
        />
      </Transition>
    </div>

    <WorkflowContextMenu
      :actions="contextActions"
      :menu="contextMenu"
      @action="handleContextAction"
      @close="closeContextMenu"
    />
  </div>
</template>
