import type { BaseQuery, BaseModel } from '#/http'

/**
 * 项目状态:0 未开始 / 1 进行中 / 2 已完成 / 3 已归档
 */
export type ProjectStatus = 0 | 1 | 2 | 3

/**
 * 优先级:1 低 / 2 中 / 3 高
 */
export type ProjectPriority = 1 | 2 | 3

/**
 * 任务状态:0 待处理 / 1 进行中 / 2 已完成
 */
export type ProjectTaskStatus = 0 | 1 | 2

/**
 * 里程碑状态:0 待达成 / 1 已达成 / 2 已延期
 */
export type MilestoneStatus = 0 | 1 | 2

/**
 * 成员角色:负责人 / 管理员 / 成员
 */
export type ProjectMemberRole = 'owner' | 'manager' | 'member'

export interface ProjectResp extends BaseModel {
  /**
   * @desc 项目编码,全局唯一
   */
  code: string
  /**
   * @desc 项目名称
   */
  name: string
  /**
   * @desc 项目描述
   */
  description?: string
  /**
   * @desc 项目状态
   */
  status: ProjectStatus
  /**
   * @desc 优先级
   */
  priority: ProjectPriority
  /**
   * @desc 负责人 id
   */
  ownerId: string
  /**
   * @desc 负责人姓名(冗余字段,便于列表展示)
   */
  ownerName: string
  /**
   * @desc 开始日期(YYYY-MM-DD)
   */
  startDate: string
  /**
   * @desc 结束日期(YYYY-MM-DD)
   */
  endDate: string
  /**
   * @desc 预算(元)
   */
  budget?: number
  /**
   * @desc 进度(0-100),按任务完成情况派生
   */
  progress: number
  /**
   * @desc 成员数量
   */
  memberCount: number
  /**
   * @desc 任务数量
   */
  taskCount: number
}

export interface ProjectQuery extends BaseQuery {
  /**
   * @desc 项目名称(模糊匹配)
   */
  name?: string
  /**
   * @desc 项目编码(模糊匹配)
   */
  code?: string
  /**
   * @desc 项目状态
   */
  status?: ProjectStatus
  /**
   * @desc 优先级
   */
  priority?: ProjectPriority
  /**
   * @desc 负责人 id
   */
  ownerId?: string
  /**
   * @desc 参与用户 id(作为负责人或项目成员)
   */
  memberId?: string
  /**
   * @desc 开始日期下限
   */
  startDate?: string
  /**
   * @desc 开始日期上限
   */
  endDate?: string
}

export interface CreateProjectReq {
  /**
   * @desc 项目编码
   */
  code: string
  /**
   * @desc 项目名称
   */
  name: string
  /**
   * @desc 项目描述
   */
  description?: string
  /**
   * @desc 项目状态
   */
  status: ProjectStatus
  /**
   * @desc 优先级
   */
  priority: ProjectPriority
  /**
   * @desc 负责人 id
   */
  ownerId: string
  /**
   * @desc 负责人姓名
   */
  ownerName: string
  /**
   * @desc 开始日期
   */
  startDate: string
  /**
   * @desc 结束日期
   */
  endDate: string
  /**
   * @desc 预算
   */
  budget?: number
}

export interface UpdateProjectReq extends Partial<CreateProjectReq> {
  /**
   * @desc 项目 id
   */
  id: string
}

export interface ProjectSummary {
  /**
   * @desc 项目总数
   */
  total: number
  /**
   * @desc 进行中数量
   */
  inProgress: number
  /**
   * @desc 已完成数量
   */
  completed: number
  /**
   * @desc 已延期数量(结束日期已过且未完成)
   */
  delayed: number
}

export interface ProjectOption {
  /**
   * @desc 项目 id
   */
  value: string
  /**
   * @desc 项目名称
   */
  label: string
  /**
   * @desc 项目编码
   */
  code: string
}

export interface ProjectTaskResp extends BaseModel {
  /**
   * @desc 所属项目 id
   */
  projectId: string
  /**
   * @desc 所属项目名称
   */
  projectName: string
  /**
   * @desc 任务标题
   */
  title: string
  /**
   * @desc 任务描述
   */
  description?: string
  /**
   * @desc 任务状态
   */
  status: ProjectTaskStatus
  /**
   * @desc 优先级
   */
  priority: ProjectPriority
  /**
   * @desc 负责人 id
   */
  assigneeId?: string
  /**
   * @desc 负责人姓名
   */
  assigneeName?: string
  /**
   * @desc 截止日期(YYYY-MM-DD)
   */
  dueDate?: string
}

export interface ProjectTaskQuery extends BaseQuery {
  /**
   * @desc 所属项目 id
   */
  projectId?: string
  /**
   * @desc 标题关键词
   */
  keyword?: string
  /**
   * @desc 任务状态
   */
  status?: ProjectTaskStatus
  /**
   * @desc 优先级
   */
  priority?: ProjectPriority
  /**
   * @desc 负责人 id
   */
  assigneeId?: string
}

export interface CreateProjectTaskReq {
  /**
   * @desc 所属项目 id
   */
  projectId: string
  /**
   * @desc 任务标题
   */
  title: string
  /**
   * @desc 任务描述
   */
  description?: string
  /**
   * @desc 任务状态
   */
  status: ProjectTaskStatus
  /**
   * @desc 优先级
   */
  priority: ProjectPriority
  /**
   * @desc 负责人 id
   */
  assigneeId?: string
  /**
   * @desc 负责人姓名
   */
  assigneeName?: string
  /**
   * @desc 截止日期
   */
  dueDate?: string
}

export interface UpdateProjectTaskReq extends Partial<CreateProjectTaskReq> {
  /**
   * @desc 任务 id
   */
  id: string
}

export interface MilestoneResp extends BaseModel {
  /**
   * @desc 所属项目 id
   */
  projectId: string
  /**
   * @desc 所属项目名称
   */
  projectName: string
  /**
   * @desc 里程碑名称
   */
  name: string
  /**
   * @desc 里程碑描述
   */
  description?: string
  /**
   * @desc 负责人姓名
   */
  ownerName?: string
  /**
   * @desc 截止日期(YYYY-MM-DD)
   */
  dueDate: string
  /**
   * @desc 里程碑状态
   */
  status: MilestoneStatus
}

export interface MilestoneQuery extends BaseQuery {
  /**
   * @desc 所属项目 id
   */
  projectId?: string
  /**
   * @desc 名称关键词
   */
  keyword?: string
  /**
   * @desc 里程碑状态
   */
  status?: MilestoneStatus
}

export interface CreateMilestoneReq {
  /**
   * @desc 所属项目 id
   */
  projectId: string
  /**
   * @desc 里程碑名称
   */
  name: string
  /**
   * @desc 里程碑描述
   */
  description?: string
  /**
   * @desc 负责人姓名
   */
  ownerName?: string
  /**
   * @desc 截止日期
   */
  dueDate: string
  /**
   * @desc 里程碑状态
   */
  status: MilestoneStatus
}

export interface UpdateMilestoneReq extends Partial<CreateMilestoneReq> {
  /**
   * @desc 里程碑 id
   */
  id: string
}

export interface ProjectMemberResp extends BaseModel {
  /**
   * @desc 所属项目 id
   */
  projectId: string
  /**
   * @desc 所属项目名称
   */
  projectName: string
  /**
   * @desc 用户 id
   */
  userId: string
  /**
   * @desc 用户姓名
   */
  userName: string
  /**
   * @desc 用户邮箱
   */
  email?: string
  /**
   * @desc 所属部门
   */
  department?: string
  /**
   * @desc 项目角色
   */
  role: ProjectMemberRole
  /**
   * @desc 加入时间
   */
  joinedAt: string
}

export interface ProjectMemberQuery extends BaseQuery {
  /**
   * @desc 所属项目 id
   */
  projectId?: string
  /**
   * @desc 姓名/邮箱关键词
   */
  keyword?: string
  /**
   * @desc 项目角色
   */
  role?: ProjectMemberRole
}

export interface CreateProjectMemberReq {
  /**
   * @desc 所属项目 id
   */
  projectId: string
  /**
   * @desc 用户 id
   */
  userId: string
  /**
   * @desc 用户姓名
   */
  userName: string
  /**
   * @desc 用户邮箱
   */
  email?: string
  /**
   * @desc 所属部门
   */
  department?: string
  /**
   * @desc 项目角色
   */
  role: ProjectMemberRole
}

export interface UpdateProjectMemberReq extends Partial<CreateProjectMemberReq> {
  /**
   * @desc 成员记录 id
   */
  id: string
}
