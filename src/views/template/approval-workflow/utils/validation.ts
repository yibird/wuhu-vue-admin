import type {
  ApprovalNode,
  ApprovalValidationIssue,
  ApprovalWorkflowSchema,
} from '../types'
import { getAssigneeLabel } from './assignee'

function createSuccessIssue(): ApprovalValidationIssue {
  return {
    id: 'valid',
    level: 'success',
    title: '流程校验通过',
    description: '节点、审批人、条件、异常策略和发布设置均已通过基础校验。',
  }
}

export function validateApprovalWorkflow(
  schema: ApprovalWorkflowSchema,
  nodes: ApprovalNode[]
) {
  const issues: ApprovalValidationIssue[] = []
  const hasStart = nodes.some((node) => node.type === 'start')
  const hasEnd = nodes.some((node) => node.type === 'end')

  if (!hasStart) {
    issues.push({
      id: 'missing-start',
      level: 'error',
      title: '缺少发起节点',
      description: '流程必须包含一个发起节点。',
    })
  }

  if (!hasEnd) {
    issues.push({
      id: 'missing-end',
      level: 'error',
      title: '缺少结束节点',
      description: '流程必须包含结束节点用于归档。',
    })
  }

  nodes.forEach((node) => {
    if (
      (node.type === 'approver' || node.type === 'handler') &&
      getAssigneeLabel(node).includes('未设置')
    ) {
      issues.push({
        id: `${node.id}-assignee`,
        level: 'error',
        nodeId: node.id,
        title: `${node.title} 未设置处理人`,
        description: '审批/办理节点必须指定成员、角色、主管或表单联系人。',
      })
    }

    if (node.type === 'condition' && !node.branches?.length) {
      issues.push({
        id: `${node.id}-branch`,
        level: 'error',
        nodeId: node.id,
        title: `${node.title} 缺少条件分支`,
        description: '条件节点至少需要一个条件分支和一个默认分支。',
      })
    }

    if (node.config.timeout.enabled && node.config.timeout.hours <= 0) {
      issues.push({
        id: `${node.id}-timeout`,
        level: 'warning',
        nodeId: node.id,
        title: `${node.title} 超时配置异常`,
        description: '超时时长应大于 0 小时。',
      })
    }
  })

  if (!schema.settings.adminUsers.length) {
    issues.push({
      id: 'missing-admin',
      level: 'warning',
      title: '缺少流程管理员',
      description: '建议设置流程管理员承接空审批人、异常转交和发布治理。',
    })
  }

  return {
    issues: issues.length ? issues : [createSuccessIssue()],
    valid: !issues.some((issue) => issue.level === 'error'),
  }
}
