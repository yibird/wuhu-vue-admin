import { createApprovalNode } from '@/components'
import type { ApprovalTemplateItem } from '@/components'

export const approvalDesignerTemplates: ApprovalTemplateItem[] = [
  {
    id: 'expense',
    title: '费用报销',
    description: '发起 → 直属主管 → 财务复核 → 归档',
    icon: 'i-lucide:receipt-text',
    nodes: [
      { ...createApprovalNode('start', '发起人提交'), id: 'start' },
      { ...createApprovalNode('approver', '直属主管审批'), id: 'manager' },
      { ...createApprovalNode('approver', '财务复核'), id: 'finance' },
      { ...createApprovalNode('end', '流程结束'), id: 'end' },
    ],
  },
  {
    id: 'leave',
    title: '请假审批',
    description: '按请假天数分流主管/总监审批，并抄送 HR',
    icon: 'i-lucide:calendar-days',
    nodes: [
      { ...createApprovalNode('start', '提交请假'), id: 'start' },
      { ...createApprovalNode('approver', '直属主管审批'), id: 'manager' },
      { ...createApprovalNode('condition', '请假天数分支'), id: 'condition' },
      { ...createApprovalNode('cc', 'HR 抄送'), id: 'cc' },
      { ...createApprovalNode('end', '结束'), id: 'end' },
    ],
  },
  {
    id: 'purchase',
    title: '采购申请',
    description: '并行财务/法务评审，通过后生成采购单',
    icon: 'i-lucide:shopping-cart',
    nodes: [
      { ...createApprovalNode('start', '提交采购'), id: 'start' },
      { ...createApprovalNode('parallel', '并行评审'), id: 'parallel' },
      { ...createApprovalNode('data', '生成采购单'), id: 'data' },
      { ...createApprovalNode('end', '结束'), id: 'end' },
    ],
  },
]
