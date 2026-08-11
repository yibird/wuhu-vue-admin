import type {
  ApprovalConditionRule,
  ApprovalNode,
  ApprovalSimulationInput,
  ApprovalSimulationStep,
} from '../types'
import { getAssigneeLabel, getSimulationInputValue } from './assignee'

function ruleMatches(
  rule: ApprovalConditionRule,
  input: ApprovalSimulationInput
) {
  const rawValue = getSimulationInputValue(input, rule.field)
  const currentValue =
    typeof rawValue === 'number' ? rawValue : String(rawValue ?? '')
  const targetValue = Number.isFinite(Number(rule.value))
    ? Number(rule.value)
    : rule.value
  const secondValue = Number.isFinite(Number(rule.secondValue))
    ? Number(rule.secondValue)
    : rule.secondValue

  switch (rule.operator) {
    case 'eq':
      return String(currentValue) === String(rule.value)
    case 'neq':
      return String(currentValue) !== String(rule.value)
    case 'gt':
      return Number(currentValue) > Number(targetValue)
    case 'gte':
      return Number(currentValue) >= Number(targetValue)
    case 'lt':
      return Number(currentValue) < Number(targetValue)
    case 'lte':
      return Number(currentValue) <= Number(targetValue)
    case 'contains':
      return String(currentValue).includes(String(rule.value))
    case 'between':
      return (
        Number(currentValue) >= Number(targetValue) &&
        Number(currentValue) <= Number(secondValue)
      )
    default:
      return false
  }
}

function walkSimulation(
  nodes: ApprovalNode[],
  input: ApprovalSimulationInput,
  steps: ApprovalSimulationStep[]
) {
  nodes.forEach((node) => {
    if (node.type === 'condition') {
      const matchedBranch =
        node.branches?.find((branch) =>
          branch.rules.length
            ? branch.rules.some((rule) => ruleMatches(rule, input))
            : false
        ) ?? node.branches?.find((branch) => !branch.rules.length)

      steps.push({
        nodeId: node.id,
        title: node.title,
        status: 'passed',
        actor: '条件引擎',
        reason: matchedBranch ? `命中：${matchedBranch.title}` : '未命中分支',
      })

      if (matchedBranch) walkSimulation(matchedBranch.nodes, input, steps)
      return
    }

    steps.push({
      nodeId: node.id,
      title: node.title,
      status: node.type === 'cc' ? 'pending' : 'passed',
      actor: getAssigneeLabel(node),
      reason:
        node.type === 'start'
          ? '发起权限与必填字段校验通过'
          : node.type === 'end'
            ? '审批记录归档完成'
            : `${node.config.assignee.multiMode} / ${node.config.timeout.enabled ? '启用超时提醒' : '无超时提醒'}`,
    })
  })
}

export function createSimulationSteps(
  nodes: ApprovalNode[],
  input: ApprovalSimulationInput
) {
  const steps: ApprovalSimulationStep[] = []
  walkSimulation(nodes, input, steps)
  return steps
}
