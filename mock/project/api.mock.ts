import { defineMock, type MockRequest } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import {
  appendMember,
  appendMilestone,
  appendProject,
  appendTask,
  deleteMembers,
  deleteMilestones,
  deleteProjects,
  deleteTasks,
  enrichProject,
  findMember,
  findMilestone,
  findProject,
  findTask,
  getProjectSummary,
  isMemberExists,
  isProjectCodeTaken,
  memberDataSource,
  milestoneDataSource,
  projectDataSource,
  taskDataSource,
  updateMemberRecord,
  updateMilestoneRecord,
  updateProjectRecord,
  updateTaskRecord,
} from './data'

import type {
  CreateMilestoneReq,
  CreateProjectMemberReq,
  CreateProjectReq,
  CreateProjectTaskReq,
  UpdateMilestoneReq,
  UpdateProjectMemberReq,
  UpdateProjectReq,
  UpdateProjectTaskReq,
} from '@/apis'

type Query = Record<string, unknown>

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(value: unknown) {
  if (value === undefined || value === '' || value === null) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function readIds(body: unknown) {
  return Array.isArray(body) ? body.map(String) : []
}

function includesKeyword(source: string, keyword: string) {
  return source.toLowerCase().includes(keyword.toLowerCase())
}

function isValidDateRange(startDate: string, endDate: string) {
  return Boolean(startDate) && Boolean(endDate) && startDate <= endDate
}

function normalizePage(query: Query) {
  return {
    current: readNumber(query.current) ?? 1,
    pageSize: readNumber(query.pageSize) ?? 10,
  }
}

export default defineMock([
  // ============================================================
  // 项目
  // ============================================================
  {
    url: '/api/project/project/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const name = readString(q.name)
      const code = readString(q.code)
      const status = readNumber(q.status)
      const priority = readNumber(q.priority)
      const ownerId = readString(q.ownerId)
      const memberId = readString(q.memberId)
      const startDate = readString(q.startDate)
      const endDate = readString(q.endDate)

      const filtered = projectDataSource.filter((item) => {
        if (name && !includesKeyword(item.name, name)) return false
        if (code && !includesKeyword(item.code, code)) return false
        if (status !== undefined && item.status !== status) return false
        if (priority !== undefined && item.priority !== priority) return false
        if (ownerId && item.ownerId !== ownerId) return false
        if (
          memberId &&
          item.ownerId !== memberId &&
          !memberDataSource.some(
            (member) =>
              member.projectId === item.id && member.userId === memberId
          )
        ) {
          return false
        }
        if (startDate && item.startDate < startDate) return false
        if (endDate && item.startDate > endDate) return false
        return true
      })

      filtered.sort((left, right) =>
        (right.updatedAt ?? '').localeCompare(left.updatedAt ?? '')
      )

      const page = getPageList(filtered.map(enrichProject), normalizePage(q))
      return apiOk(page)
    },
  },
  {
    url: '/api/project/project/getSummary',
    method: 'GET',
    body: () => apiOk(getProjectSummary()),
  },
  {
    url: '/api/project/project/getOptions',
    method: 'GET',
    body: () =>
      apiOk(
        projectDataSource.map((item) => ({
          value: item.id,
          label: item.name,
          code: item.code,
        }))
      ),
  },
  {
    url: '/api/project/project/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const project = id ? findProject(id) : undefined
      return project ? apiOk(project) : apiErr('项目不存在')
    },
  },
  {
    url: '/api/project/project/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateProjectReq
      if (!input?.name?.trim()) return apiErr('请输入项目名称')
      if (!input?.code?.trim()) return apiErr('请输入项目编码')
      if (isProjectCodeTaken(input.code)) return apiErr('项目编码已存在')
      if (!isValidDateRange(input.startDate, input.endDate)) {
        return apiErr('结束日期不能早于开始日期')
      }
      return apiOk(appendProject(input).id)
    },
  },
  {
    url: '/api/project/project/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateProjectReq
      if (!input?.id) return apiErr('缺少项目 id')
      const current = findProject(input.id)
      if (!current) return apiErr('项目不存在')
      if (input.code && isProjectCodeTaken(input.code, input.id)) {
        return apiErr('项目编码已存在')
      }
      const startDate = input.startDate ?? current.startDate
      const endDate = input.endDate ?? current.endDate
      if (!isValidDateRange(startDate, endDate)) {
        return apiErr('结束日期不能早于开始日期')
      }
      return apiOk(updateProjectRecord(input)?.id)
    },
  },
  {
    url: '/api/project/project/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的项目')
      deleteProjects(ids)
      return apiOk(ids.length)
    },
  },

  // ============================================================
  // 任务
  // ============================================================
  {
    url: '/api/project/task/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const projectId = readString(q.projectId)
      const keyword = readString(q.keyword)
      const status = readNumber(q.status)
      const priority = readNumber(q.priority)
      const assigneeId = readString(q.assigneeId)

      const filtered = taskDataSource.filter((item) => {
        if (projectId && item.projectId !== projectId) return false
        if (keyword && !includesKeyword(item.title, keyword)) return false
        if (status !== undefined && item.status !== status) return false
        if (priority !== undefined && item.priority !== priority) return false
        if (assigneeId && item.assigneeId !== assigneeId) return false
        return true
      })

      filtered.sort((left, right) =>
        (right.createdAt ?? '').localeCompare(left.createdAt ?? '')
      )
      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/project/task/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const task = id ? findTask(id) : undefined
      return task ? apiOk(task) : apiErr('任务不存在')
    },
  },
  {
    url: '/api/project/task/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateProjectTaskReq
      if (!input?.projectId || !findProject(input.projectId)) {
        return apiErr('请选择有效的所属项目')
      }
      if (!input?.title?.trim()) return apiErr('请输入任务标题')
      return apiOk(appendTask(input).id)
    },
  },
  {
    url: '/api/project/task/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateProjectTaskReq
      if (!input?.id) return apiErr('缺少任务 id')
      if (!findTask(input.id)) return apiErr('任务不存在')
      if (input.projectId && !findProject(input.projectId)) {
        return apiErr('请选择有效的所属项目')
      }
      return apiOk(updateTaskRecord(input)?.id)
    },
  },
  {
    url: '/api/project/task/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的任务')
      deleteTasks(ids)
      return apiOk(ids.length)
    },
  },

  // ============================================================
  // 里程碑
  // ============================================================
  {
    url: '/api/project/milestone/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const projectId = readString(q.projectId)
      const keyword = readString(q.keyword)
      const status = readNumber(q.status)

      const filtered = milestoneDataSource.filter((item) => {
        if (projectId && item.projectId !== projectId) return false
        if (keyword && !includesKeyword(item.name, keyword)) return false
        if (status !== undefined && item.status !== status) return false
        return true
      })

      filtered.sort((left, right) => left.dueDate.localeCompare(right.dueDate))
      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/project/milestone/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const milestone = id ? findMilestone(id) : undefined
      return milestone ? apiOk(milestone) : apiErr('里程碑不存在')
    },
  },
  {
    url: '/api/project/milestone/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateMilestoneReq
      if (!input?.projectId || !findProject(input.projectId)) {
        return apiErr('请选择有效的所属项目')
      }
      if (!input?.name?.trim()) return apiErr('请输入里程碑名称')
      if (!input?.dueDate) return apiErr('请选择截止日期')
      return apiOk(appendMilestone(input).id)
    },
  },
  {
    url: '/api/project/milestone/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateMilestoneReq
      if (!input?.id) return apiErr('缺少里程碑 id')
      if (!findMilestone(input.id)) return apiErr('里程碑不存在')
      if (input.projectId && !findProject(input.projectId)) {
        return apiErr('请选择有效的所属项目')
      }
      return apiOk(updateMilestoneRecord(input)?.id)
    },
  },
  {
    url: '/api/project/milestone/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的里程碑')
      deleteMilestones(ids)
      return apiOk(ids.length)
    },
  },

  // ============================================================
  // 项目成员
  // ============================================================
  {
    url: '/api/project/member/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const projectId = readString(q.projectId)
      const keyword = readString(q.keyword)
      const role = readString(q.role)

      const filtered = memberDataSource.filter((item) => {
        if (projectId && item.projectId !== projectId) return false
        if (
          keyword &&
          !includesKeyword(item.userName, keyword) &&
          !includesKeyword(item.email ?? '', keyword)
        ) {
          return false
        }
        if (role && item.role !== role) return false
        return true
      })

      filtered.sort((left, right) =>
        (right.joinedAt ?? '').localeCompare(left.joinedAt ?? '')
      )
      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/project/member/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const member = id ? findMember(id) : undefined
      return member ? apiOk(member) : apiErr('成员不存在')
    },
  },
  {
    url: '/api/project/member/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateProjectMemberReq
      if (!input?.projectId || !findProject(input.projectId)) {
        return apiErr('请选择有效的所属项目')
      }
      if (!input?.userId) return apiErr('请选择成员')
      if (isMemberExists(input.projectId, input.userId)) {
        return apiErr('该成员已在项目中')
      }
      return apiOk(appendMember(input).id)
    },
  },
  {
    url: '/api/project/member/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateProjectMemberReq
      if (!input?.id) return apiErr('缺少成员 id')
      const current = findMember(input.id)
      if (!current) return apiErr('成员不存在')
      if (
        input.userId &&
        isMemberExists(current.projectId, input.userId, current.id)
      ) {
        return apiErr('该成员已在项目中')
      }
      return apiOk(updateMemberRecord(input)?.id)
    },
  },
  {
    url: '/api/project/member/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要移除的成员')
      deleteMembers(ids)
      return apiOk(ids.length)
    },
  },
])
