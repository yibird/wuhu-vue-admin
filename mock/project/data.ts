import { faker } from '@faker-js/faker'
import { dataSource as deptDataSource } from '../sys/dept/data'
import { dataSource as userDataSource } from '../sys/user/data'

import type {
  CreateMilestoneReq,
  CreateProjectMemberReq,
  CreateProjectReq,
  CreateProjectTaskReq,
  MilestoneResp,
  MilestoneStatus,
  ProjectMemberResp,
  ProjectPriority,
  ProjectResp,
  ProjectStatus,
  ProjectSummary,
  ProjectTaskResp,
  ProjectTaskStatus,
  UpdateMilestoneReq,
  UpdateProjectMemberReq,
  UpdateProjectReq,
  UpdateProjectTaskReq,
} from '@/apis'

const projectNames = [
  '客户数据中台建设',
  '移动端体验升级',
  '供应链可视化',
  '智能客服知识库',
  '营销活动配置平台',
  '财务对账自动化',
  '合同全生命周期管理',
  '仓储库存优化',
  '会员成长体系',
  '数据资产治理',
  '低代码表单引擎',
  '统一身份认证',
  '实时监控告警平台',
  '内容审核工作流',
  '渠道结算系统',
  '售后服务工单',
  '门店数字化改造',
  'BI 报表体系',
  '主数据管理',
  '研发效能度量',
  '海外站点多语言',
  '支付网关升级',
  '风控模型迭代',
  '运营后台重构',
] as const

const taskTitles = [
  '需求梳理与评审',
  '数据库模型设计',
  '接口设计与联调',
  '前端页面开发',
  '权限与安全评审',
  '测试用例编写',
  '性能压测与调优',
  '监控指标接入',
  '灰度发布验证',
  '用户验收测试',
  '上线部署',
  '操作文档整理',
] as const

const milestoneNames = [
  '需求冻结',
  '方案评审通过',
  '开发完成',
  '测试通过',
  '灰度发布',
  '正式上线',
  '项目验收',
] as const

const departmentNameById = new Map(
  deptDataSource
    .filter((dept) => dept.type === 1)
    .map((dept) => [dept.id, dept.name])
)

interface TeamUser {
  id: string
  name: string
  email: string
  department: string
}

const teamUsers: TeamUser[] = userDataSource.slice(0, 40).map((user) => ({
  id: user.id,
  name: user.realname || user.nickname || user.username,
  email: user.email,
  department: departmentNameById.get(user.deptId ?? '') ?? '总部',
}))

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(base: Date, days: number) {
  const date = new Date(base)
  date.setDate(date.getDate() + days)
  return date
}

function pickTeamUser(index: number) {
  return teamUsers[index % teamUsers.length]
}

const NOW = new Date()

function createBaseFields() {
  return {
    dataStatus: true,
    deleted: false,
    version: 1,
    createdBy: '系统管理员',
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
  }
}

/** 项目状态分布:进行中为主,少量未开始/已完成/已归档 */
function resolveProjectStatus(index: number): ProjectStatus {
  const pattern: ProjectStatus[] = [1, 1, 1, 1, 2, 0, 1, 3]
  return pattern[index % pattern.length]
}

const projectStatusPlan: ProjectStatus[] = projectNames.map((_, index) =>
  resolveProjectStatus(index)
)

export const projectDataSource: ProjectResp[] = projectNames.map(
  (name, index) => {
    const owner = pickTeamUser(index * 7)
    const status = projectStatusPlan[index]
    const startOffset =
      status === 0
        ? faker.number.int({ min: 7, max: 30 })
        : -faker.number.int({ min: 30, max: 240 })
    const start = addDays(NOW, startOffset)
    const duration = faker.number.int({ min: 60, max: 180 })

    return {
      ...createBaseFields(),
      id: `${index + 1}`,
      code: `PJ-${NOW.getFullYear()}-${String(index + 1).padStart(3, '0')}`,
      name,
      description: `${name}项目:${faker.lorem.sentence()}`,
      status,
      priority: faker.helpers.arrayElement([1, 2, 2, 3] as ProjectPriority[]),
      ownerId: owner.id,
      ownerName: owner.name,
      startDate: toDateString(start),
      endDate: toDateString(addDays(start, duration)),
      budget: faker.number.int({ min: 20, max: 200 }) * 10_000,
      progress: 0,
      memberCount: 0,
      taskCount: 0,
    }
  }
)

export const memberDataSource: ProjectMemberResp[] = []
export const taskDataSource: ProjectTaskResp[] = []
export const milestoneDataSource: MilestoneResp[] = []

let memberSeq = 0
let taskSeq = 0
let milestoneSeq = 0

function nextId(prefix: string, seq: number) {
  return `${prefix}-${seq}`
}

function createMemberRecord(
  project: ProjectResp,
  user: TeamUser,
  role: ProjectMemberResp['role'],
  joinedAt: string
): ProjectMemberResp {
  memberSeq += 1
  return {
    ...createBaseFields(),
    id: nextId('member', memberSeq),
    projectId: project.id,
    projectName: project.name,
    userId: user.id,
    userName: user.name,
    email: user.email,
    department: user.department,
    role,
    joinedAt,
  }
}

function createTaskRecord(
  project: ProjectResp,
  status: ProjectTaskStatus,
  index: number
): ProjectTaskResp {
  taskSeq += 1
  const members = memberDataSource.filter(
    (member) => member.projectId === project.id
  )
  const assignee = members[index % Math.max(members.length, 1)]
  const dueDate = toDateString(
    addDays(
      new Date(project.startDate),
      faker.number.int({ min: 15, max: 150 })
    )
  )

  return {
    ...createBaseFields(),
    id: nextId('task', taskSeq),
    projectId: project.id,
    projectName: project.name,
    title: `${faker.helpers.arrayElement(taskTitles)}`,
    description: faker.lorem.sentence(),
    status,
    priority: faker.helpers.arrayElement([1, 2, 2, 3] as ProjectPriority[]),
    assigneeId: assignee?.userId,
    assigneeName: assignee?.userName,
    dueDate,
  }
}

function resolveTaskStatus(projectStatus: ProjectStatus): ProjectTaskStatus {
  if (projectStatus === 2 || projectStatus === 3) return 2
  if (projectStatus === 0) return 0
  return faker.helpers.arrayElement([0, 1, 2, 1, 2, 1] as ProjectTaskStatus[])
}

function resolveMilestoneStatus(
  projectStatus: ProjectStatus,
  dueDate: string
): MilestoneStatus {
  if (projectStatus === 2 || projectStatus === 3) return 1
  return dueDate < toDateString(NOW) ? 2 : 0
}

for (const project of projectDataSource) {
  const owner = teamUsers.find(
    (user) => user.id === project.ownerId
  ) as TeamUser
  const memberCount = faker.number.int({ min: 3, max: 6 })
  const joinedAt = toDateString(addDays(new Date(project.startDate), 1))

  memberDataSource.push(createMemberRecord(project, owner, 'owner', joinedAt))
  for (let index = 1; index < memberCount; index += 1) {
    const user = pickTeamUser(Number(project.id) * 13 + index)
    if (
      memberDataSource.some(
        (member) => member.projectId === project.id && member.userId === user.id
      )
    )
      continue
    memberDataSource.push(
      createMemberRecord(
        project,
        user,
        index === 1 ? 'manager' : 'member',
        joinedAt
      )
    )
  }

  const taskCount = faker.number.int({ min: 4, max: 8 })
  for (let index = 0; index < taskCount; index += 1) {
    taskDataSource.push(
      createTaskRecord(project, resolveTaskStatus(project.status), index)
    )
  }

  const milestoneCount = faker.number.int({ min: 2, max: 5 })
  for (let index = 0; index < milestoneCount; index += 1) {
    milestoneSeq += 1
    const dueDate = toDateString(
      addDays(new Date(project.startDate), ((index + 1) * 25) % 150)
    )
    milestoneDataSource.push({
      ...createBaseFields(),
      id: nextId('milestone', milestoneSeq),
      projectId: project.id,
      projectName: project.name,
      name: faker.helpers.arrayElement(milestoneNames),
      description: faker.lorem.sentence(),
      ownerName: owner.name,
      dueDate,
      status: resolveMilestoneStatus(project.status, dueDate),
    })
  }
}

function getProjectTasks(projectId: string) {
  return taskDataSource.filter((task) => task.projectId === projectId)
}

/**
 * 按关联数据派生进度/成员数/任务数
 * @param project 项目记录
 * @returns 补齐统计字段的项目
 */
export function enrichProject(project: ProjectResp): ProjectResp {
  const tasks = getProjectTasks(project.id)
  const doneCount = tasks.filter((task) => task.status === 2).length

  return {
    ...project,
    progress: tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0,
    taskCount: tasks.length,
    memberCount: memberDataSource.filter(
      (member) => member.projectId === project.id
    ).length,
  }
}

export function findProject(id: string) {
  const project = projectDataSource.find((item) => item.id === id)
  return project ? enrichProject(project) : undefined
}

export function findTask(id: string) {
  return taskDataSource.find((item) => item.id === id)
}

export function findMilestone(id: string) {
  return milestoneDataSource.find((item) => item.id === id)
}

export function findMember(id: string) {
  return memberDataSource.find((item) => item.id === id)
}

export function isProjectCodeTaken(code: string, excludeId?: string) {
  const normalized = code.trim().toLowerCase()
  return projectDataSource.some(
    (item) => item.id !== excludeId && item.code.toLowerCase() === normalized
  )
}

export function isMemberExists(
  projectId: string,
  userId: string,
  excludeId?: string
) {
  return memberDataSource.some(
    (item) =>
      item.id !== excludeId &&
      item.projectId === projectId &&
      item.userId === userId
  )
}

export function touchProject(projectId: string) {
  const project = projectDataSource.find((item) => item.id === projectId)
  if (project) project.updatedAt = new Date().toISOString()
}

export function appendProject(input: CreateProjectReq): ProjectResp {
  const project: ProjectResp = {
    ...createBaseFields(),
    id: `${projectDataSource.length + 1}`,
    code: input.code.trim(),
    name: input.name.trim(),
    description: input.description,
    status: input.status,
    priority: input.priority,
    ownerId: input.ownerId,
    ownerName: input.ownerName,
    startDate: input.startDate,
    endDate: input.endDate,
    budget: input.budget,
    progress: 0,
    memberCount: 0,
    taskCount: 0,
  }
  projectDataSource.unshift(project)

  const owner = teamUsers.find((user) => user.id === input.ownerId)
  if (owner) {
    memberDataSource.unshift(
      createMemberRecord(project, owner, 'owner', toDateString(NOW))
    )
  }

  return enrichProject(project)
}

export function updateProjectRecord(
  input: UpdateProjectReq
): ProjectResp | undefined {
  const project = projectDataSource.find((item) => item.id === input.id)
  if (!project) return undefined

  Object.assign(project, {
    ...input,
    code: input.code?.trim() ?? project.code,
    name: input.name?.trim() ?? project.name,
    updatedAt: new Date().toISOString(),
  })

  // 项目信息变更时同步冗余名称,保证关联列表展示一致
  taskDataSource.forEach((task) => {
    if (task.projectId === project.id) task.projectName = project.name
  })
  milestoneDataSource.forEach((milestone) => {
    if (milestone.projectId === project.id) milestone.projectName = project.name
  })
  memberDataSource.forEach((member) => {
    if (member.projectId === project.id) member.projectName = project.name
  })

  return enrichProject(project)
}

export function deleteProjects(ids: Array<string | number>) {
  const keys = new Set(ids.map(String))
  for (let index = projectDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(projectDataSource[index].id))
      projectDataSource.splice(index, 1)
  }
  // 级联清理关联数据
  for (let index = taskDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(taskDataSource[index].projectId))
      taskDataSource.splice(index, 1)
  }
  for (let index = milestoneDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(milestoneDataSource[index].projectId)) {
      milestoneDataSource.splice(index, 1)
    }
  }
  for (let index = memberDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(memberDataSource[index].projectId)) {
      memberDataSource.splice(index, 1)
    }
  }
}

export function getProjectSummary(): ProjectSummary {
  const today = toDateString(NOW)
  return {
    total: projectDataSource.length,
    inProgress: projectDataSource.filter((item) => item.status === 1).length,
    completed: projectDataSource.filter((item) => item.status === 2).length,
    delayed: projectDataSource.filter(
      (item) => item.status !== 2 && item.status !== 3 && item.endDate < today
    ).length,
  }
}

export function appendTask(input: CreateProjectTaskReq): ProjectTaskResp {
  const project = projectDataSource.find((item) => item.id === input.projectId)
  taskSeq += 1
  const task: ProjectTaskResp = {
    ...createBaseFields(),
    id: nextId('task', taskSeq),
    projectId: input.projectId,
    projectName: project?.name ?? '',
    title: input.title.trim(),
    description: input.description,
    status: input.status,
    priority: input.priority,
    assigneeId: input.assigneeId,
    assigneeName: input.assigneeName,
    dueDate: input.dueDate,
  }
  taskDataSource.unshift(task)
  touchProject(input.projectId)
  return task
}

export function updateTaskRecord(
  input: UpdateProjectTaskReq
): ProjectTaskResp | undefined {
  const task = taskDataSource.find((item) => item.id === input.id)
  if (!task) return undefined
  Object.assign(task, { ...input, updatedAt: new Date().toISOString() })
  touchProject(task.projectId)
  return task
}

export function deleteTasks(ids: Array<string | number>) {
  const keys = new Set(ids.map(String))
  for (let index = taskDataSource.length - 1; index >= 0; index -= 1) {
    const task = taskDataSource[index]
    if (keys.has(task.id)) {
      taskDataSource.splice(index, 1)
      touchProject(task.projectId)
    }
  }
}

export function appendMilestone(input: CreateMilestoneReq): MilestoneResp {
  const project = projectDataSource.find((item) => item.id === input.projectId)
  milestoneSeq += 1
  const milestone: MilestoneResp = {
    ...createBaseFields(),
    id: nextId('milestone', milestoneSeq),
    projectId: input.projectId,
    projectName: project?.name ?? '',
    name: input.name.trim(),
    description: input.description,
    ownerName: input.ownerName,
    dueDate: input.dueDate,
    status: input.status,
  }
  milestoneDataSource.unshift(milestone)
  touchProject(input.projectId)
  return milestone
}

export function updateMilestoneRecord(
  input: UpdateMilestoneReq
): MilestoneResp | undefined {
  const milestone = milestoneDataSource.find((item) => item.id === input.id)
  if (!milestone) return undefined
  Object.assign(milestone, { ...input, updatedAt: new Date().toISOString() })
  touchProject(milestone.projectId)
  return milestone
}

export function deleteMilestones(ids: Array<string | number>) {
  const keys = new Set(ids.map(String))
  for (let index = milestoneDataSource.length - 1; index >= 0; index -= 1) {
    const milestone = milestoneDataSource[index]
    if (keys.has(milestone.id)) {
      milestoneDataSource.splice(index, 1)
      touchProject(milestone.projectId)
    }
  }
}

export function appendMember(input: CreateProjectMemberReq): ProjectMemberResp {
  const project = projectDataSource.find((item) => item.id === input.projectId)
  memberSeq += 1
  const member: ProjectMemberResp = {
    ...createBaseFields(),
    id: nextId('member', memberSeq),
    projectId: input.projectId,
    projectName: project?.name ?? '',
    userId: input.userId,
    userName: input.userName,
    email: input.email,
    department: input.department,
    role: input.role,
    joinedAt: toDateString(NOW),
  }
  memberDataSource.unshift(member)
  touchProject(input.projectId)
  return member
}

export function updateMemberRecord(
  input: UpdateProjectMemberReq
): ProjectMemberResp | undefined {
  const member = memberDataSource.find((item) => item.id === input.id)
  if (!member) return undefined
  Object.assign(member, { ...input, updatedAt: new Date().toISOString() })
  touchProject(member.projectId)
  return member
}

export function deleteMembers(ids: Array<string | number>) {
  const keys = new Set(ids.map(String))
  for (let index = memberDataSource.length - 1; index >= 0; index -= 1) {
    const member = memberDataSource[index]
    if (keys.has(member.id)) {
      memberDataSource.splice(index, 1)
      touchProject(member.projectId)
    }
  }
}
