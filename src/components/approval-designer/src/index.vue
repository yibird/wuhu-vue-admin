<template>
  <component :is="wrapperComponent" v-bind="wrapperProps">
    <main
      class="approval-designer-main relative h-full min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] gap-12 overflow-hidden bg-page p-12 max-[980px]:p-8"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.page"
    >
      <ApprovalHeader
        v-if="!embedded"
        :issue-count="stats.issueCount"
        :node-count="stats.nodeCount"
        :publish-busy="publishBusy"
        :readonly="readonly"
        :save-busy="saveBusy"
        :settings="schema.settings"
        @copy-schema="copySchema"
        @download-schema="downloadSchema"
        @open-simulator="openSimulationModal"
        @publish="handlePublish"
        @save="handleSave"
        @toggle-source="toggleSourcePanel"
      />

      <section
        class="min-h-0 min-w-0 grid grid-cols-[300px_minmax(620px,1fr)_360px] gap-12 overflow-hidden max-[1480px]:grid-cols-[260px_minmax(0,1fr)_300px] max-[980px]:grid-cols-[minmax(0,1fr)] max-[980px]:grid-rows-[minmax(180px,0.24fr)_minmax(280px,0.48fr)_minmax(220px,0.28fr)]"
      >
        <ApprovalPalette
          :palette="palette"
          :readonly="readonly"
          :templates="templates"
          @add="handleAddFromPalette"
          @apply-template="handleApplyTemplate"
        />

        <ApprovalCanvas
          :nodes="schema.nodes"
          :readonly="readonly"
          :selected-ids="selectedNodeIds"
          :settings="schema.settings"
          @add-after="handleAddAfter"
          @duplicate="handleDuplicateNode"
          @duplicate-selected="handleDuplicateSelectedNodes"
          @move-node="handleMoveNode"
          @remove="handleRemoveNode"
          @remove-selected="handleRemoveSelectedNodes"
          @select="handleSelectNode"
          @select-many="handleSelectMany"
        />

        <div class="approval-workflow__right h-full min-h-0 overflow-hidden">
          <ApprovalInspector
            :form-fields="schema.formFields"
            :node="selectedNode"
            :readonly="readonly"
            :users="users"
            class="h-full"
            @add-branch="handleAddBranch"
            @update-branch="handleUpdateBranch"
            @update-config="handleUpdateNodeConfig"
            @update-node="handleUpdateNode"
          />
        </div>
      </section>

      <div
        v-if="loading"
        class="absolute inset-0 z-50 flex items-center justify-center bg-container/70 backdrop-blur-2"
      >
        <a-spin />
      </div>
    </main>
  </component>

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
        @validate="handleValidate"
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

<script setup lang="ts">
import { message } from 'antdv-next'
import { WView } from '../../view'
import {
  Canvas as ApprovalCanvas,
  Header as ApprovalHeader,
  Inspector as ApprovalInspector,
  Palette as ApprovalPalette,
  Simulator as ApprovalSimulator,
  SourcePanel as ApprovalSourcePanel,
} from './components'
import { useApprovalWorkflowDesigner } from './hooks'
import { APPROVAL_WORKFLOW_SELECTORS } from './constants'
import type {
  ApprovalBranch,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalNodeType,
  ApprovalPaletteItem,
  ApprovalTemplateItem,
  ApprovalUserRef,
  ApprovalValidationIssue,
  ApprovalWorkflowSchema,
} from './types'

const props = withDefaults(
  defineProps<{
    /**
     * @desc 可选择的用户列表
     * @default []
     */
    users?: readonly ApprovalUserRef[]
    /**
     * @desc 流程模板
     * @default []
     */
    templates?: readonly ApprovalTemplateItem[]
    /**
     * @desc 节点面板,不传时使用内置面板
     */
    palette?: readonly ApprovalPaletteItem[]
    /**
     * @desc 只读模式
     * @default false
     */
    readonly?: boolean
    /**
     * @desc 数据加载中
     * @default false
     */
    loading?: boolean
    /**
     * @desc 保存中
     * @default false
     */
    saveBusy?: boolean
    /**
     * @desc 发布中
     * @default false
     */
    publishBusy?: boolean
    /**
     * @desc 初始选中节点 id
     */
    initialSelectedNodeId?: string
    /**
     * @desc 嵌入模式:不渲染整页容器与设计器头部,用于步骤向导内嵌
     * @default false
     */
    embedded?: boolean
  }>(),
  {
    users: () => [],
    templates: () => [],
    palette: undefined,
    readonly: false,
    loading: false,
    saveBusy: false,
    publishBusy: false,
    initialSelectedNodeId: undefined,
    embedded: false,
  }
)

const emits = defineEmits<{
  /**
   * @desc 审批流发生变化
   * @param schema 最新审批流
   */
  change: [schema: ApprovalWorkflowSchema]
  /**
   * @desc 请求保存
   * @param schema 最新审批流
   */
  save: [schema: ApprovalWorkflowSchema]
  /**
   * @desc 请求发布
   * @param schema 最新审批流
   */
  publish: [schema: ApprovalWorkflowSchema]
  /**
   * @desc 校验完成
   * @param result 校验结果
   */
  validate: [result: { valid: boolean; issues: ApprovalValidationIssue[] }]
}>()

const model = defineModel<ApprovalWorkflowSchema>({ required: true })

const wrapperComponent = computed(() => (props.embedded ? 'div' : WView))
const wrapperProps = computed(() =>
  props.embedded
    ? { class: 'approval-designer-embedded h-full min-h-0 overflow-hidden' }
    : {
        full: true,
        padding: 0,
        style: { height: 'calc(100vh - 90px)', minHeight: 0 },
        class: 'approval-workflow-page overflow-hidden',
      }
)

const {
  flatNodes,
  palette,
  schema,
  selectedNode,
  selectedNodeId,
  simulationInput,
  simulationSteps,
  sourceCode,
  sourceError,
  sourcePanelOpen,
  stats,
  templates,
  users,
  validationIssues,
  addBranch,
  addNodeAfter,
  addNodeFromPalette,
  applyTemplate,
  copySchema,
  downloadSchema,
  duplicateNode,
  getSchema,
  handleSourceChange: applySourceChange,
  moveNode,
  removeNode,
  runSimulation,
  selectNode,
  setSchema,
  toggleSourcePanel,
  updateBranch,
  updateNode,
  updateNodeConfig,
  validateWorkflow,
} = useApprovalWorkflowDesigner({
  initialSchema: model.value,
  users: () => props.users,
  templates: () => props.templates,
  palette: () => props.palette,
  initialSelectedNodeId: props.initialSelectedNodeId,
  onChange(next) {
    if (isSameSchema(next, model.value)) return
    model.value = next
    emits('change', next)
  },
  onValidate(result) {
    emits('validate', result)
  },
})

const selectedNodeIds = shallowRef<string[]>([selectedNodeId.value])
const simulationModalOpen = shallowRef(false)

watch(model, (value) => {
  if (!value || isSameSchema(value, getSchema())) return
  setSchema(value)
})

function isSameSchema(
  left?: ApprovalWorkflowSchema,
  right?: ApprovalWorkflowSchema
) {
  if (!left || !right) return left === right
  return JSON.stringify(left) === JSON.stringify(right)
}

function guardReadonly() {
  return props.readonly
}

function handleSelectNode(id: string) {
  selectedNodeIds.value = [id]
  selectNode(id)
}

function handleSelectMany(ids: string[]) {
  selectedNodeIds.value = ids
  selectNode(ids[0] ?? '')
}

function handleAddFromPalette(item: ApprovalPaletteItem) {
  if (guardReadonly()) return
  addNodeFromPalette(item)
}

function handleApplyTemplate(templateId: string) {
  if (guardReadonly()) return
  applyTemplate(templateId)
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleAddAfter(id: string, type: ApprovalNodeType) {
  if (guardReadonly()) return
  addNodeAfter(id, type)
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleDuplicateNode(id: string) {
  if (guardReadonly()) return
  duplicateNode(id)
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleMoveNode(id: string, offset: -1 | 1) {
  if (guardReadonly()) return
  moveNode(id, offset)
}

function handleRemoveNode(id: string) {
  if (guardReadonly()) return
  removeNode(id)
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleDuplicateSelectedNodes() {
  if (guardReadonly()) return
  selectedNodeIds.value.forEach((id) => duplicateNode(id))
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleRemoveSelectedNodes() {
  if (guardReadonly()) return
  const nodeMap = new Map(flatNodes.value.map((node) => [node.id, node]))
  selectedNodeIds.value
    .filter((id) => !nodeMap.get(id)?.required)
    .forEach((id) => removeNode(id))
  selectedNodeIds.value = selectedNodeId.value ? [selectedNodeId.value] : []
}

function handleAddBranch(nodeId: string) {
  if (guardReadonly()) return
  addBranch(nodeId)
}

function handleUpdateBranch(
  nodeId: string,
  branchId: string,
  patch: Partial<ApprovalBranch>
) {
  if (guardReadonly()) return
  updateBranch(nodeId, branchId, patch)
}

function handleUpdateNode(id: string, patch: Partial<ApprovalNode>) {
  if (guardReadonly()) return
  updateNode(id, patch)
}

function handleUpdateNodeConfig(
  id: string,
  patch: Partial<ApprovalNodeConfig>
) {
  if (guardReadonly()) return
  updateNodeConfig(id, patch)
}

function handleSourceChange(value: string) {
  if (guardReadonly()) return
  applySourceChange(value)
}

function handleValidate() {
  validateWorkflow()
}

function handleSave() {
  if (guardReadonly()) return
  emits('save', getSchema())
}

function handlePublish() {
  if (guardReadonly()) return
  if (!validateWorkflow()) {
    message.error('流程存在阻塞问题，无法发布')
    return
  }
  emits('publish', getSchema())
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

defineExpose({
  validate: validateWorkflow,
  getSchema,
  setSchema,
  selectNode,
})
</script>
