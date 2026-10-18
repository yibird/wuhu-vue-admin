/**
 * 审批流设计器
 *
 * 树形审批节点、条件/并行分支、审批人配置、字段权限、超时转交、
 * 模拟校验与 Schema 编辑。组件较重,统一按需加载。
 */
export const ApprovalDesigner = defineAsyncComponent(
  () => import('./src/index.vue')
)

export {
  approvalFormFields,
  approvalPalette,
  createApprovalNode,
  createDefaultApprovalExtensions,
  createEmptyApprovalSchema,
  createNodeConfig,
} from './src/data'
export { APPROVAL_WORKFLOW_SELECTORS } from './src/constants'
export { collectNodes } from './src/utils/node-tree'
export { validateApprovalWorkflow } from './src/utils/validation'
export type {
  ApprovalActionKey,
  ApprovalAssigneeConfig,
  ApprovalAutomationAction,
  ApprovalAutomationTrigger,
  ApprovalAutomationType,
  ApprovalDataPermission,
  ApprovalExceptionPolicy,
  ApprovalFormFieldType,
  ApprovalGlobalTimeoutSettings,
  ApprovalInitiationRules,
  ApprovalNotificationSettings,
  ApprovalPermissionRole,
  ApprovalRoleFieldPermission,
  ApprovalWorkflowExtensions,
  ApprovalAssigneeMode,
  ApprovalBranch,
  ApprovalConditionRule,
  ApprovalFieldPermission,
  ApprovalFormField,
  ApprovalMultiMode,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalNodeType,
  ApprovalPaletteItem,
  ApprovalPublishState,
  ApprovalSimulationInput,
  ApprovalSimulationStep,
  ApprovalTemplateItem,
  ApprovalTimeoutRule,
  ApprovalUserRef,
  ApprovalValidationIssue,
  ApprovalValidationLevel,
  ApprovalWorkflowSchema,
  ApprovalWorkflowSettings,
  ConditionOperator,
  EmptyApproverStrategy,
  FieldPermissionMode,
} from './src/types'
