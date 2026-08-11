import type { Component } from 'vue'
import type { ApprovalNodeType } from '../../types'
import ApproverNode from './ApproverNode.vue'
import CcNode from './CcNode.vue'
import ConditionNode from './ConditionNode.vue'
import DataNode from './DataNode.vue'
import EndNode from './EndNode.vue'
import HandlerNode from './HandlerNode.vue'
import MessageNode from './MessageNode.vue'
import ParallelNode from './ParallelNode.vue'
import ScriptNode from './ScriptNode.vue'
import StartNode from './StartNode.vue'
import SubProcessNode from './SubProcessNode.vue'

const approvalNodeComponentMap = {
  start: StartNode,
  approver: ApproverNode,
  handler: HandlerNode,
  cc: CcNode,
  condition: ConditionNode,
  parallel: ParallelNode,
  subProcess: SubProcessNode,
  data: DataNode,
  script: ScriptNode,
  message: MessageNode,
  end: EndNode,
} satisfies Record<ApprovalNodeType, Component>

export function resolveApprovalNodeComponent(type: ApprovalNodeType) {
  return approvalNodeComponentMap[type]
}
