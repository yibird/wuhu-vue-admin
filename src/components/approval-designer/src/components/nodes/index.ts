import type { Component } from 'vue'
import type { ApprovalNodeType } from '../../types'
import ApproverNode from './approver-node.vue'
import CcNode from './cc-node.vue'
import ConditionNode from './condition-node.vue'
import DataNode from './data-node.vue'
import EndNode from './end-node.vue'
import HandlerNode from './handler-node.vue'
import MessageNode from './message-node.vue'
import ParallelNode from './parallel-node.vue'
import ScriptNode from './script-node.vue'
import StartNode from './start-node.vue'
import SubProcessNode from './sub-process-node.vue'

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
