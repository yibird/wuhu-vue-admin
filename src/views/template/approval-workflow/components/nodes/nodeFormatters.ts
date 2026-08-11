import type {
  ApprovalAssigneeMode,
  ApprovalMultiMode,
  ApprovalNode,
  ApprovalUserRef,
} from '../../types'

export const assigneeModeText: Record<ApprovalAssigneeMode, string> = {
  initiator: '发起人本人',
  initiatorSelect: '发起人自选',
  supervisor: '直属主管',
  departmentSupervisor: '部门主管',
  role: '指定角色',
  user: '指定成员',
  formUser: '表单联系人',
  continuousSupervisor: '连续多级主管',
}

export const multiModeText: Record<ApprovalMultiMode, string> = {
  sequential: '依次审批',
  parallelAll: '会签全部同意',
  parallelAny: '或签一人同意',
  percent: '百分比通过',
}

export function formatUsers(users: readonly ApprovalUserRef[]) {
  if (!users.length) return '未指定成员'
  return users.map((user) => user.name).join('、')
}

export function formatTimeout(node: ApprovalNode) {
  if (!node.config.timeout.enabled) return '未启用超时'
  return `${node.config.timeout.hours}h 超时`
}

export function formatActionCount(node: ApprovalNode) {
  return `${node.config.actions.length} 个动作`
}

export function getBranchCount(node: ApprovalNode) {
  return node.branches?.length ?? 0
}

export function getBranchRuleCount(node: ApprovalNode) {
  return (
    node.branches?.reduce((total, branch) => total + branch.rules.length, 0) ??
    0
  )
}
