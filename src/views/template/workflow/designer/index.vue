<template>
  <div
    class="workflow-designer h-full min-h-0 flex flex-col gap-10 overflow-hidden bg-page p-10 max-sm:p-8"
  >
    <div class="relative min-h-0 min-w-0 flex-1 overflow-hidden">
      <WorkflowCanvas
        v-model:nodes="nodes"
        v-model:edges="edges"
        :ai-panel-open="aiPanelOpen"
        :can-redo="canRedo"
        :can-remove-selected="canRemoveSelected"
        :can-undo="canUndo"
        :default-edge-options="defaultEdgeOptions"
        :is-paused="isPaused"
        :is-running="isRunning"
        :nodes-locked="nodesLocked"
        :run-logs="runLogs"
        :source-panel-open="sourcePanelOpen"
        :title="workflowSchema.title"
        :validation-issues="validationIssues"
        :selected-test-case-id="selectedTestCaseId"
        :test-cases="testCases"
        @arrange-nodes="arrangeNodes"
        @connect="handleConnect"
        @cancel-run="cancelWorkflow"
        @copy-schema="copyWorkflowSchema"
        @edge-context-menu="openEdgeContextMenu"
        @download-schema="downloadWorkflowSchema"
        @node-click="handleNodeClick"
        @node-context-menu="openNodeContextMenu"
        @node-drag-start="handleNodeDragStart"
        @node-drag-stop="handleNodeDragStop"
        @pane-click="clearSelectedNode"
        @pane-context-menu="openPaneContextMenu"
        @remove-selected="removeSelectedNode"
        @redo="redoWorkflow"
        @run="runWorkflow"
        @resume-run="resumeWorkflow"
        @select-test-case="selectTestCase"
        @publish="publishWorkflow"
        @share-workflow="shareWorkflow"
        @toggle-nodes-locked="toggleNodesLocked"
        @toggle-ai="toggleAiPanel"
        @toggle-source="toggleSourcePanel"
        @undo="undoWorkflow"
      />

      <WorkflowSourcePanel
        :error="schemaError"
        :open="sourcePanelOpen"
        :source-code="sourceCode"
        :source-status="sourceStatus"
        @apply="applySourceCode()"
        @close="closeSourcePanel"
        @copy="copyWorkflowSchema"
        @download="downloadWorkflowSchema"
        @format="formatSourceCode"
        @source-change="handleSourceCodeChange"
      />

      <Transition name="slide-left">
        <WorkflowAiPanel
          v-if="aiPanelOpen"
          v-model:prompt="aiPrompt"
          class="absolute bottom-12 left-12 top-60 z-20 w-400 max-w-[calc(100%-24px)]"
          :busy="aiBusy"
          :messages="aiMessages"
          :plan="aiPlan"
          :suggestions="aiSuggestions"
          @apply="applyAiPlan"
          @apply-suggestion="applyAiSuggestion"
          @close="closeAiPanel"
          @discard="discardAiPlan"
          @generate="generateWorkflowFromPrompt()"
        />
      </Transition>

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

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {
  AiPanel as WorkflowAiPanel,
  Canvas as WorkflowCanvas,
  ContextMenu as WorkflowContextMenu,
  Inspector as WorkflowInspector,
  SourcePanel as WorkflowSourcePanel,
} from './components'
import { useWorkflowDesigner } from './hooks'
import { findWorkflowDefinition } from '../shared/data'

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
  cancelWorkflow,
  contextActions,
  contextMenu,
  defaultEdgeOptions,
  edges,
  isPaused,
  isRunning,
  nodes,
  nodesLocked,
  runLogs,
  validationIssues,
  schemaError,
  sourceStatus,
  selectedNodeData,
  selectedNodeId,
  selectedTestCaseId,
  sourceCode,
  sourcePanelOpen,
  testCases,
  workflowSchema,
  aiBusy,
  aiMessages,
  aiPanelOpen,
  aiPlan,
  aiPrompt,
  aiSuggestions,
  arrangeNodes,
  applyAiPlan,
  applyAiSuggestion,
  applySourceCode,
  clearSelectedNode,
  closeAiPanel,
  closeContextMenu,
  closeSourcePanel,
  copyWorkflowSchema,
  discardAiPlan,
  downloadWorkflowSchema,
  formatSourceCode,
  generateWorkflowFromPrompt,
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
  publishWorkflow,
  resumeWorkflow,
  runWorkflow,
  shareWorkflow,
  selectTestCase,
  toggleAiPanel,
  toggleNodesLocked,
  toggleSourcePanel,
  updateSelectedConfig,
  updateSelectedData,
  redoWorkflow,
  undoWorkflow,
} = useWorkflowDesigner({ initialTitle })
</script>

<style lang="less" scoped>
@import './token.less';
</style>
