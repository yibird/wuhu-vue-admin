import type { BaseQuery, BaseResp } from '#/http'
import type { ApprovalWorkflowSchema } from '@/components/approval-designer'

/**
 * 审批流状态
 */
export type ApprovalDefinitionState = 'draft' | 'published' | 'disabled'

/**
 * 审批实例状态
 */
export type ApprovalInstanceStatus =
  | 'running'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'timeout'
  | 'terminated'

/**
 * 审批实例节点状态
 */
export type ApprovalInstanceStepStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'skipped'

export interface ApprovalDefinitionResp extends BaseResp {
  /**
   * @desc 审批流名称
   */
  name: string
  /**
   * @desc 审批流编码
   */
  code: string
  /**
   * @desc 分类 id
   */
  categoryId: string
  /**
   * @desc 分类名称
   */
  categoryName: string
  /**
   * @desc 图标
   */
  icon?: string
  /**
   * @desc 描述
   */
  description?: string
  /**
   * @desc 状态
   */
  state: ApprovalDefinitionState
  /**
   * @desc 流程 Schema
   */
  schema: ApprovalWorkflowSchema
  /**
   * @desc 节点数量
   */
  nodeCount: number
  /**
   * @desc 实例数量
   */
  instanceCount: number
  /**
   * @desc 负责人 id
   */
  ownerId: string
  /**
   * @desc 负责人名称
   */
  ownerName: string
}

export interface ApprovalDefinitionQuery extends BaseQuery {
  /**
   * @desc 名称/编码关键词
   */
  keyword?: string
  /**
   * @desc 分类 id
   */
  categoryId?: string
  /**
   * @desc 状态
   */
  state?: ApprovalDefinitionState
  /**
   * @desc 负责人 id
   */
  ownerId?: string
}

export interface CreateApprovalDefinitionReq {
  /**
   * @desc 名称
   */
  name: string
  /**
   * @desc 编码,不传时由后端生成
   */
  code?: string
  /**
   * @desc 分类 id
   */
  categoryId: string
  /**
   * @desc 图标
   */
  icon?: string
  /**
   * @desc 描述
   */
  description?: string
  /**
   * @desc 流程 Schema
   */
  schema: ApprovalWorkflowSchema
  /**
   * @desc 负责人 id
   */
  ownerId?: string
  /**
   * @desc 负责人名称
   */
  ownerName?: string
}

export interface UpdateApprovalDefinitionReq extends Partial<CreateApprovalDefinitionReq> {
  /**
   * @desc 审批流 id
   */
  id: string
}

export interface ApprovalCategoryResp extends BaseResp {
  /**
   * @desc 分类名称
   */
  name: string
  /**
   * @desc 分类编码
   */
  code: string
  /**
   * @desc 描述
   */
  description?: string
  /**
   * @desc 图标
   */
  icon?: string
  /**
   * @desc 主题色
   */
  color?: string
  /**
   * @desc 流程数量
   */
  definitionCount: number
}

export interface CreateApprovalCategoryReq {
  /**
   * @desc 分类名称
   */
  name: string
  /**
   * @desc 分类编码
   */
  code?: string
  /**
   * @desc 描述
   */
  description?: string
  /**
   * @desc 图标
   */
  icon?: string
  /**
   * @desc 主题色
   */
  color?: string
  /**
   * @desc 排序
   */
  sort?: number
}

export interface UpdateApprovalCategoryReq extends Partial<CreateApprovalCategoryReq> {
  /**
   * @desc 分类 id
   */
  id: string
}

export interface ApprovalInstanceStep {
  /**
   * @desc 节点 id
   */
  id: string
  /**
   * @desc 节点名称
   */
  nodeName: string
  /**
   * @desc 处理人
   */
  approverName: string
  /**
   * @desc 节点状态
   */
  status: ApprovalInstanceStepStatus
  /**
   * @desc 处理意见
   */
  comment?: string
  /**
   * @desc 处理时间
   */
  handledAt?: string
}

export interface ApprovalInstanceResp extends BaseResp {
  /**
   * @desc 审批流 id
   */
  definitionId: string
  /**
   * @desc 审批流名称
   */
  definitionName: string
  /**
   * @desc 实例标题
   */
  title: string
  /**
   * @desc 发起人 id
   */
  initiatorId: string
  /**
   * @desc 发起人名称
   */
  initiatorName: string
  /**
   * @desc 发起人部门
   */
  deptName?: string
  /**
   * @desc 实例状态
   */
  status: ApprovalInstanceStatus
  /**
   * @desc 当前节点
   */
  currentNode?: string
  /**
   * @desc 进度(0-100)
   */
  progress: number
  /**
   * @desc 开始时间
   */
  startedAt: string
  /**
   * @desc 结束时间
   */
  finishedAt?: string
  /**
   * @desc 耗时(毫秒)
   */
  durationMs?: number
  /**
   * @desc 审批节点流转记录
   */
  steps: ApprovalInstanceStep[]
}

export interface ApprovalInstanceQuery extends BaseQuery {
  /**
   * @desc 关键词(标题/发起人)
   */
  keyword?: string
  /**
   * @desc 审批流 id
   */
  definitionId?: string
  /**
   * @desc 实例状态
   */
  status?: ApprovalInstanceStatus
}

export interface ApprovalMonitorSummary {
  /**
   * @desc 实例总数
   */
  total: number
  /**
   * @desc 运行中
   */
  running: number
  /**
   * @desc 待审批
   */
  pending: number
  /**
   * @desc 已通过
   */
  approved: number
  /**
   * @desc 已驳回
   */
  rejected: number
  /**
   * @desc 已超时
   */
  timeout: number
  /**
   * @desc 通过率(0-100)
   */
  successRate: number
  /**
   * @desc 平均耗时(毫秒)
   */
  averageDurationMs: number
}
