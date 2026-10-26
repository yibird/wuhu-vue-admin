<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 b-1-regular bg-container shadow-sm"
    :data-testid="APPROVAL_WORKFLOW_SELECTORS.inspector"
  >
    <header class="border-b border-regular px-12 py-10">
      <h2 class="m-0 text-14px font-800 text-primary">节点属性</h2>
      <p class="m-0 mt-3 text-12px text-secondary">
        审批人、字段权限、动作、超时和异常策略
      </p>
    </header>

    <div
      v-if="node"
      class="min-h-0 p-12 w-full h-full overflow-x-hidden overflow-y-auto"
    >
      <div :class="readonly ? 'pointer-events-none' : ''">
        <div class="grid gap-10">
          <label class="block text-12px text-secondary">
            节点名称
            <a-input
              class="mt-5"
              :value="node.title"
              @update:value="updateNodeTitle"
            />
          </label>
          <label class="block text-12px text-secondary">
            节点说明
            <a-textarea
              class="mt-5"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :value="node.description"
              @update:value="updateNodeDescription"
            />
          </label>
        </div>

        <div class="my-13 h-1px bg-border"></div>

        <div
          v-if="node.type !== 'start' && node.type !== 'end'"
          class="grid gap-10"
        >
          <label class="block text-12px text-secondary">
            处理人规则
            <a-select
              class="mt-5 w-full"
              :value="node.config.assignee.mode"
              :options="assigneeModes"
              @change="updateAssigneeMode"
            />
          </label>

          <label class="block text-12px text-secondary">
            指定成员
            <a-select
              class="mt-5 w-full"
              mode="multiple"
              :max-tag-count="2"
              :options="userOptions"
              :value="node.config.assignee.users.map((user) => user.id)"
              @change="updateAssigneeUsers"
            />
          </label>

          <div class="grid grid-cols-2 gap-8">
            <label class="block text-12px text-secondary">
              多人审批
              <a-select
                class="mt-5 w-full"
                :value="node.config.assignee.multiMode"
                :options="multiModes"
                @change="updateMultiMode"
              />
            </label>
            <label class="block text-12px text-secondary">
              主管层级
              <a-input-number
                class="mt-5 w-full"
                :min="1"
                :value="node.config.assignee.supervisorLevel"
                @update:value="updateSupervisorLevel"
              />
            </label>
          </div>

          <div class="rounded-7 bg-fill p-10">
            <strong class="text-12px text-primary">允许动作</strong>
            <a-checkbox-group
              class="mt-8 flex flex-wrap gap-8 text-12px"
              :options="actionOptions"
              :value="node.config.actions"
              @change="updateActions"
            />
          </div>

          <div class="rounded-7 bg-fill p-10">
            <div class="flex items-center justify-between gap-8">
              <strong class="text-12px text-primary">超时与异常</strong>
              <a-checkbox
                :checked="node.config.timeout.enabled"
                @update:checked="updateTimeoutEnabled"
              >
                启用
              </a-checkbox>
            </div>
            <div class="mt-8 grid grid-cols-2 gap-8">
              <label class="block text-12px text-secondary">
                超时小时
                <a-input-number
                  class="mt-5 w-full"
                  :min="1"
                  :value="node.config.timeout.hours"
                  @update:value="updateTimeoutHours"
                />
              </label>
              <label class="block text-12px text-secondary">
                提醒间隔
                <a-input-number
                  class="mt-5 w-full"
                  :min="1"
                  :value="node.config.timeout.remindEveryHours"
                  @update:value="updateTimeoutRemindEveryHours"
                />
              </label>
            </div>

            <label class="mt-8 block text-12px text-secondary">
              空审批人策略
              <a-select
                class="mt-5 w-full"
                :options="emptyStrategyOptions"
                :value="node.config.assignee.emptyStrategy"
                @change="
                  (value: unknown) =>
                    updateAssigneePolicy({
                      emptyStrategy:
                        value as ApprovalNode['config']['assignee']['emptyStrategy'],
                    })
                "
              />
            </label>

            <div class="mt-8 flex items-center justify-between gap-8">
              <span class="text-12px text-secondary">重复审批人自动去重</span>
              <a-switch
                :checked="node.config.assignee.deduplicate"
                @update:checked="
                  (checked: boolean) =>
                    updateAssigneePolicy({ deduplicate: checked })
                "
              />
            </div>
            <div class="mt-6 flex items-center justify-between gap-8">
              <span class="text-12px text-secondary"
                >允许审批自己提交的单据</span
              >
              <a-switch
                :checked="node.config.assignee.allowSelfApproval"
                @update:checked="
                  (checked: boolean) =>
                    updateAssigneePolicy({ allowSelfApproval: checked })
                "
              />
            </div>
          </div>
        </div>

        <div
          v-if="node.type === 'condition'"
          class="mt-12 rounded-7 bg-fill p-10"
        >
          <div class="mb-8 flex items-center justify-between gap-8">
            <strong class="text-12px text-primary">条件分支</strong>
            <a-button
              size="small"
              type="primary"
              @click="emits('addBranch', node.id)"
            >
              新增分支
            </a-button>
          </div>
          <div
            v-for="branch in node.branches ?? []"
            :key="branch.id"
            class="mb-10 rounded-6 b-1-regular bg-container p-10"
          >
            <label class="block text-12px text-secondary">
              分支名称
              <a-input
                class="mt-5"
                :value="branch.title"
                @update:value="
                  (value: string) => updateBranchTitle(branch.id, value)
                "
              />
            </label>

            <div class="mt-8 grid gap-6">
              <div
                v-for="rule in branch.rules"
                :key="rule.id"
                class="rounded-6 bg-fill p-8"
              >
                <div class="grid grid-cols-2 gap-6">
                  <a-select
                    size="small"
                    :options="fieldOptions"
                    :value="rule.field"
                    @change="
                      (value: unknown) =>
                        updateConditionField(branch, rule.id, String(value))
                    "
                  />
                  <a-select
                    size="small"
                    :options="operatorOptions"
                    :value="rule.operator"
                    @change="
                      (value: unknown) =>
                        updateConditionRule(branch, rule.id, {
                          operator: value as ConditionOperator,
                        })
                    "
                  />
                </div>
                <div class="mt-6 flex items-center gap-6">
                  <a-input
                    size="small"
                    :value="rule.value"
                    placeholder="条件值"
                    @update:value="
                      (value: string) =>
                        updateConditionRule(branch, rule.id, {
                          value: String(value),
                        })
                    "
                  />
                  <a-input
                    v-if="rule.operator === 'between'"
                    size="small"
                    :value="rule.secondValue"
                    placeholder="结束值"
                    @update:value="
                      (value: string) =>
                        updateConditionRule(branch, rule.id, {
                          secondValue: String(value),
                        })
                    "
                  />
                  <a-button
                    danger
                    size="small"
                    type="text"
                    @click="removeConditionRule(branch, rule.id)"
                  >
                    <Icon name="i-lucide:trash-2" :size="14" />
                  </a-button>
                </div>
              </div>
            </div>

            <a-button
              block
              class="mt-8"
              size="small"
              type="dashed"
              @click="addConditionRule(branch)"
            >
              新增条件
            </a-button>
          </div>
        </div>

        <FieldPermissions
          :fields="node.config.fieldPermissions"
          :options="fieldPermissionOptions"
          @update="updateFieldPermissionFromSelect"
        />
      </div>
    </div>

    <div v-else class="p-18 text-center text-13px text-secondary">
      请选择画布节点后编辑审批规则。
    </div>
  </section>
</template>

<script setup lang="ts">
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'
import { useApprovalInspectorActions } from '../hooks'
import { createId } from '../utils/node-tree'
import FieldPermissions from './field-permissions.vue'
import type {
  ApprovalAssigneeMode,
  ApprovalBranch,
  ApprovalConditionRule,
  ApprovalFormField,
  ApprovalMultiMode,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalUserRef,
  ConditionOperator,
  FieldPermissionMode,
} from '../types'

const props = withDefaults(
  defineProps<{
    node?: ApprovalNode
    users: readonly ApprovalUserRef[]
    formFields?: readonly ApprovalFormField[]
    readonly?: boolean
  }>(),
  { formFields: () => [], readonly: false }
)

const emits = defineEmits<{
  addBranch: [nodeId: string]
  updateBranch: [
    nodeId: string,
    branchId: string,
    patch: Partial<ApprovalBranch>,
  ]
  updateConfig: [id: string, patch: Partial<ApprovalNodeConfig>]
  updateNode: [id: string, patch: Partial<ApprovalNode>]
}>()

const assigneeModes: { label: string; value: ApprovalAssigneeMode }[] = [
  { label: '指定成员', value: 'user' },
  { label: '指定角色', value: 'role' },
  { label: '直属主管', value: 'supervisor' },
  { label: '部门主管', value: 'departmentSupervisor' },
  { label: '连续多级主管', value: 'continuousSupervisor' },
  { label: '发起人自选', value: 'initiatorSelect' },
  { label: '表单联系人', value: 'formUser' },
  { label: '发起人本人', value: 'initiator' },
]

const multiModes: { label: string; value: ApprovalMultiMode }[] = [
  { label: '依次审批', value: 'sequential' },
  { label: '会签全部同意', value: 'parallelAll' },
  { label: '或签一人同意', value: 'parallelAny' },
  { label: '百分比通过', value: 'percent' },
]

const actionOptions = [
  { label: '同意', value: 'agree' },
  { label: '拒绝', value: 'reject' },
  { label: '转交', value: 'transfer' },
  { label: '加签', value: 'addSigner' },
  { label: '退回', value: 'rollback' },
  { label: '评论', value: 'comment' },
] as const

const fieldPermissionOptions: { label: string; value: FieldPermissionMode }[] =
  [
    { label: '只读', value: 'readonly' },
    { label: '可编辑', value: 'editable' },
    { label: '隐藏', value: 'hidden' },
  ]

const userOptions = computed(() =>
  props.users.map((user) => ({
    label: `${user.name} / ${user.dept}`,
    value: user.id,
  }))
)

const fieldOptions = computed(() =>
  props.formFields
    .filter((field) => field.type !== 'divider')
    .map((field) => ({
      label: field.label,
      value: field.key,
    }))
)

const emptyStrategyOptions = [
  { label: '自动通过', value: 'autoPass' },
  { label: '转交管理员', value: 'admin' },
  { label: '报错拦截', value: 'error' },
]

const operatorOptions: { label: string; value: ConditionOperator }[] = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '包含', value: 'contains' },
  { label: '介于', value: 'between' },
]

function updateAssigneePolicy(
  patch: Partial<ApprovalNode['config']['assignee']>
) {
  const node = props.node
  if (!node) return
  emits('updateConfig', node.id, {
    assignee: {
      ...node.config.assignee,
      ...patch,
    },
  })
}

function updateBranchRules(
  branch: ApprovalBranch,
  rules: ApprovalConditionRule[]
) {
  const node = props.node
  if (!node) return
  emits('updateBranch', node.id, branch.id, { rules })
}

function addConditionRule(branch: ApprovalBranch) {
  const field = props.formFields[0]
  updateBranchRules(branch, [
    ...branch.rules,
    {
      id: createId('rule'),
      field: field?.key ?? 'amount',
      label: field?.label ?? '金额',
      operator: 'eq',
      value: '',
    },
  ])
}

function updateConditionRule(
  branch: ApprovalBranch,
  ruleId: string,
  patch: Partial<ApprovalConditionRule>
) {
  updateBranchRules(
    branch,
    branch.rules.map((rule) =>
      rule.id === ruleId ? { ...rule, ...patch } : rule
    )
  )
}

function updateConditionField(
  branch: ApprovalBranch,
  ruleId: string,
  key: string
) {
  const field = props.formFields.find((item) => item.key === key)
  updateConditionRule(branch, ruleId, {
    field: key,
    label: field?.label ?? key,
  })
}

function removeConditionRule(branch: ApprovalBranch, ruleId: string) {
  updateBranchRules(
    branch,
    branch.rules.filter((rule) => rule.id !== ruleId)
  )
}

const {
  updateActions,
  updateAssigneeMode,
  updateAssigneeUsers,
  updateBranchTitle,
  updateFieldPermissionFromSelect,
  updateMultiMode,
  updateNodeDescription,
  updateNodeTitle,
  updateSupervisorLevel,
  updateTimeoutEnabled,
  updateTimeoutHours,
  updateTimeoutRemindEveryHours,
} = useApprovalInspectorActions(() => props.node, toRef(props, 'users'), {
  updateBranch: (nodeId, branchId, patch) =>
    emits('updateBranch', nodeId, branchId, patch),
  updateConfig: (id, patch) => emits('updateConfig', id, patch),
  updateNode: (id, patch) => emits('updateNode', id, patch),
})
</script>
