<script setup lang="ts">
import {
  Canvas as ApprovalCanvas,
  Header as ApprovalHeader,
  Inspector as ApprovalInspector,
  Palette as ApprovalPalette,
  Simulator as ApprovalSimulator,
  SourcePanel as ApprovalSourcePanel,
} from './components'
import { useApprovalWorkflowDesigner } from './composables/useWorkflowDesigner'
import { APPROVAL_WORKFLOW_SELECTORS } from './constants'

const {
  approvalPalette,
  approvalTemplates,
  approvalUsers,
  publishBusy,
  schema,
  selectedNode,
  selectedNodeId,
  simulationInput,
  simulationSteps,
  sourceCode,
  sourceError,
  sourcePanelOpen,
  stats,
  validationIssues,
  addBranch,
  addNodeAfter,
  addNodeFromPalette,
  applyTemplate,
  copySchema,
  downloadSchema,
  duplicateNode,
  flatNodes,
  handleSourceChange,
  publishWorkflow,
  removeNode,
  runSimulation,
  selectNode,
  toggleSourcePanel,
  updateBranch,
  updateNode,
  updateNodeConfig,
  validateWorkflow,
} = useApprovalWorkflowDesigner()

const selectedNodeIds = shallowRef<string[]>([selectedNodeId.value])
const simulationModalOpen = shallowRef(false)

function handleSelectNode(id: string) {
  selectedNodeIds.value = [id]
  selectNode(id)
}

function handleSelectMany(ids: string[]) {
  selectedNodeIds.value = ids
  selectNode(ids[0] ?? '')
}

function handleDuplicateNode(id: string) {
  duplicateNode(id)
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleRemoveNode(id: string) {
  removeNode(id)
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleDuplicateSelectedNodes() {
  selectedNodeIds.value.forEach((id) => duplicateNode(id))
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleRemoveSelectedNodes() {
  const nodeMap = new Map(flatNodes.value.map((node) => [node.id, node]))
  selectedNodeIds.value
    .filter((id) => !nodeMap.get(id)?.required)
    .forEach((id) => removeNode(id))
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

watch(selectedNodeId, (id) => {
  if (selectedNodeIds.value.length > 1 && selectedNodeIds.value.includes(id)) {
    return
  }

  selectedNodeIds.value = id ? [id] : []
})

function openSimulationModal() {
  simulationModalOpen.value = true
}

function closeSimulationModal() {
  simulationModalOpen.value = false
}
</script>

<template>
  <WView
    :full="true"
    :padding="0"
    :style="{ height: 'calc(100vh - 90px)', minHeight: 0 }"
    class="approval-workflow-page overflow-hidden"
  >
    <main
      class="h-full min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] gap-12 overflow-hidden bg-page p-12 max-[980px]:p-8"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.page"
    >
      <ApprovalHeader
        :issue-count="stats.issueCount"
        :node-count="stats.nodeCount"
        :publish-busy="publishBusy"
        :settings="schema.settings"
        @copy-schema="copySchema"
        @download-schema="downloadSchema"
        @open-simulator="openSimulationModal"
        @publish="publishWorkflow"
        @toggle-source="toggleSourcePanel"
      />

      <section
        class="min-h-0 min-w-0 grid grid-cols-[300px_minmax(620px,1fr)_360px] gap-12 overflow-hidden max-[1480px]:grid-cols-[260px_minmax(0,1fr)_300px] max-[980px]:grid-cols-[minmax(0,1fr)] max-[980px]:grid-rows-[minmax(180px,0.24fr)_minmax(280px,0.48fr)_minmax(220px,0.28fr)]"
      >
        <ApprovalPalette
          :palette="approvalPalette"
          :templates="approvalTemplates"
          @add="addNodeFromPalette"
          @apply-template="applyTemplate"
        />

        <ApprovalCanvas
          :nodes="schema.nodes"
          :selected-ids="selectedNodeIds"
          :settings="schema.settings"
          @add-after="addNodeAfter"
          @duplicate="handleDuplicateNode"
          @duplicate-selected="handleDuplicateSelectedNodes"
          @remove="handleRemoveNode"
          @remove-selected="handleRemoveSelectedNodes"
          @select="handleSelectNode"
          @select-many="handleSelectMany"
        />

        <div class="approval-workflow__right h-full min-h-0 overflow-hidden">
          <ApprovalInspector
            :node="selectedNode"
            :users="approvalUsers"
            class="h-full"
            @add-branch="addBranch"
            @update-branch="updateBranch"
            @update-config="updateNodeConfig"
            @update-node="updateNode"
          />
        </div>
      </section>
    </main>
  </WView>

  <a-modal
    :footer="null"
    :open="simulationModalOpen"
    :width="760"
    class="approval-simulator-modal"
    title="模拟与校验"
    @cancel="closeSimulationModal"
  >
    <div class="h-[68vh] min-h-0">
      <ApprovalSimulator
        v-model:input="simulationInput"
        :issues="validationIssues"
        :steps="simulationSteps"
        class="h-full shadow-none"
        @run="runSimulation"
        @validate="validateWorkflow"
      />
    </div>
  </a-modal>

  <ApprovalSourcePanel
    :error="sourceError"
    :open="sourcePanelOpen"
    :source-code="sourceCode"
    @close="toggleSourcePanel"
    @source-change="handleSourceChange"
  />
</template>
