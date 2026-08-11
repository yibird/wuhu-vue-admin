import type { ApprovalNode, ApprovalSimulationInput } from '../types'

export function getSimulationInputValue(
  input: ApprovalSimulationInput,
  field: string
) {
  switch (field) {
    case 'amount':
      return input.amount
    case 'leaveDays':
      return input.leaveDays
    case 'department':
      return input.department
    case 'applicant':
      return input.applicant
    case 'assetType':
      return input.assetType
    default:
      return ''
  }
}

export function getAssigneeLabel(node: ApprovalNode) {
  const { assignee, ccUsers } = node.config
  if (node.type === 'cc')
    return ccUsers.map((user) => user.name).join('、') || '未设置抄送人'

  if (assignee.mode === 'user')
    return assignee.users.map((user) => user.name).join('、') || '未设置审批人'
  if (assignee.mode === 'role') return assignee.roles.join('、') || '未设置角色'
  if (assignee.mode === 'initiatorSelect') return '发起人自选'
  if (assignee.mode === 'formUser')
    return `表单字段：${assignee.formField ?? '未选择'}`
  if (assignee.mode === 'continuousSupervisor')
    return `连续 ${assignee.supervisorLevel} 级主管`
  if (assignee.mode === 'departmentSupervisor') return '部门主管'
  if (assignee.mode === 'initiator') return '发起人'
  return `${assignee.supervisorLevel} 级主管`
}
