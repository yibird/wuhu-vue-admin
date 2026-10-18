import { defineMock, type MockRequest } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import {
  appendCategory,
  appendDefinition,
  appendGroup,
  categoryDataSource,
  definitionDataSource,
  deleteCategories,
  deleteDefinitions,
  deleteGroups,
  duplicateDefinition,
  enrichGroup,
  findCategory,
  findDefinition,
  findGroup,
  findInstance,
  groupDataSource,
  instanceDataSource,
  publishDefinition,
  updateCategory,
  updateDefinition,
  updateGroup,
} from './data'

import type {
  ApprovalDefinitionResp,
  ApprovalInstanceResp,
  ApprovalMonitorSummary,
  CreateApprovalCategoryReq,
  CreateApprovalDefinitionReq,
  CreateApprovalGroupReq,
  UpdateApprovalCategoryReq,
  UpdateApprovalDefinitionReq,
  UpdateApprovalGroupReq,
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

function normalizePage(query: Query) {
  return {
    current: readNumber(query.current) ?? 1,
    pageSize: readNumber(query.pageSize) ?? 10,
  }
}

function countNodes(schema: ApprovalDefinitionResp['schema']) {
  let count = 0
  const walk = (nodes: ApprovalDefinitionResp['schema']['nodes']) => {
    nodes.forEach((node) => {
      count += 1
      node.children?.forEach((child) => walk([child]))
      node.branches?.forEach((branch) => walk(branch.nodes))
    })
  }
  walk(schema.nodes)
  return count
}

export default defineMock([
  // ============================================================
  // 审批流定义
  // ============================================================
  {
    url: '/api/approval/definition/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const keyword = readString(q.keyword)
      const categoryId = readString(q.categoryId)
      const state = readString(q.state)
      const ownerId = readString(q.ownerId)

      const filtered = definitionDataSource.filter((item) => {
        if (
          keyword &&
          !includesKeyword(item.name, keyword) &&
          !includesKeyword(item.code, keyword) &&
          !includesKeyword(item.description ?? '', keyword)
        ) {
          return false
        }
        if (categoryId && item.categoryId !== categoryId) return false
        if (state && item.state !== state) return false
        if (ownerId && item.ownerId !== ownerId) return false
        return true
      })

      filtered.sort((left, right) =>
        (right.updatedAt ?? '').localeCompare(left.updatedAt ?? '')
      )

      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/approval/definition/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const definition = id ? findDefinition(id) : undefined
      return definition ? apiOk(definition) : apiErr('审批流不存在')
    },
  },
  {
    url: '/api/approval/definition/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateApprovalDefinitionReq
      if (!input?.name?.trim()) return apiErr('请输入审批流名称')
      if (!input?.categoryId || !findCategory(input.categoryId)) {
        return apiErr('请选择有效的流程分类')
      }
      const definition = appendDefinition({
        ...input,
        nodeCount: input.schema ? countNodes(input.schema) : 3,
      })
      return apiOk(definition.id)
    },
  },
  {
    url: '/api/approval/definition/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateApprovalDefinitionReq
      if (!input?.id) return apiErr('缺少审批流 id')
      if (!findDefinition(input.id)) return apiErr('审批流不存在')
      if (input.categoryId && !findCategory(input.categoryId)) {
        return apiErr('请选择有效的流程分类')
      }
      const definition = updateDefinition(
        input as Partial<ApprovalDefinitionResp> & { id: string }
      )
      return definition ? apiOk(definition.id) : apiErr('审批流不存在')
    },
  },
  {
    url: '/api/approval/definition/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的审批流')
      deleteDefinitions(ids)
      return apiOk(ids.length)
    },
  },
  {
    url: '/api/approval/definition/publish',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const id = readString((body as Query).id)
      const definition = id ? publishDefinition(id) : undefined
      return definition ? apiOk(definition.id) : apiErr('审批流不存在')
    },
  },
  {
    url: '/api/approval/definition/duplicate',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const id = readString((body as Query).id)
      const definition = id ? duplicateDefinition(id) : undefined
      return definition ? apiOk(definition.id) : apiErr('审批流不存在')
    },
  },

  // ============================================================
  // 审批分类
  // ============================================================
  {
    url: '/api/approval/category/getList',
    method: 'GET',
    body: () =>
      apiOk(
        [...categoryDataSource].sort(
          (left, right) => (left.sort ?? 0) - (right.sort ?? 0)
        )
      ),
  },
  {
    url: '/api/approval/category/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateApprovalCategoryReq
      if (!input?.name?.trim()) return apiErr('请输入分类名称')
      const exists = categoryDataSource.some(
        (item) => item.name === input.name.trim()
      )
      if (exists) return apiErr('分类名称已存在')
      return apiOk(appendCategory(input).id)
    },
  },
  {
    url: '/api/approval/category/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateApprovalCategoryReq
      if (!input?.id) return apiErr('缺少分类 id')
      if (!findCategory(input.id)) return apiErr('分类不存在')
      const category = updateCategory(input)
      return category ? apiOk(category.id) : apiErr('分类不存在')
    },
  },
  {
    url: '/api/approval/category/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的分类')
      const occupied = definitionDataSource.find((item) =>
        ids.includes(item.categoryId)
      )
      if (occupied) {
        return apiErr(`分类「${occupied.categoryName}」下仍有审批流，无法删除`)
      }
      deleteCategories(ids)
      return apiOk(ids.length)
    },
  },

  // ============================================================
  // 流程分组
  // ============================================================
  {
    url: '/api/approval/group/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const keyword = readString(q.keyword).toLowerCase()
      const enabledRaw = readString(q.enabled)
      const enabled = enabledRaw === '' ? undefined : enabledRaw === 'true'

      const filtered = groupDataSource
        .map(enrichGroup)
        .filter((item) => {
          if (
            keyword &&
            !includesKeyword(item.name, keyword) &&
            !includesKeyword(item.code, keyword)
          ) {
            return false
          }
          if (enabled !== undefined && item.enabled !== enabled) return false
          return true
        })
        .sort((left, right) => (left.sort ?? 0) - (right.sort ?? 0))

      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/approval/group/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const group = id ? findGroup(id) : undefined
      return group ? apiOk(enrichGroup(group)) : apiErr('分组不存在')
    },
  },
  {
    url: '/api/approval/group/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as CreateApprovalGroupReq
      if (!input?.name?.trim()) return apiErr('请输入分组名称')
      const id = appendGroup(input)
      return id ? apiOk(id) : apiErr('分组编码已存在')
    },
  },
  {
    url: '/api/approval/group/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as UpdateApprovalGroupReq
      if (!findGroup(input?.id ?? '')) return apiErr('分组不存在')
      if (input.name !== undefined && !input.name.trim()) {
        return apiErr('请输入分组名称')
      }
      const group = updateGroup(input)
      return group ? apiOk(group.id) : apiErr('分组编码已存在')
    },
  },
  {
    url: '/api/approval/group/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的分组')
      deleteGroups(ids)
      return apiOk(ids.length)
    },
  },

  // ============================================================
  // 审批实例
  // ============================================================
  {
    url: '/api/approval/instance/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const keyword = readString(q.keyword)
      const definitionId = readString(q.definitionId)
      const status = readString(q.status)

      const filtered = instanceDataSource.filter((item) => {
        if (
          keyword &&
          !includesKeyword(item.title, keyword) &&
          !includesKeyword(item.initiatorName, keyword)
        ) {
          return false
        }
        if (definitionId && item.definitionId !== definitionId) return false
        if (status && item.status !== status) return false
        return true
      })

      filtered.sort((left, right) =>
        (right.startedAt ?? '').localeCompare(left.startedAt ?? '')
      )

      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/approval/instance/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const id = readString((query as Query).id)
      const instance = id ? findInstance(id) : undefined
      return instance ? apiOk(instance) : apiErr('审批实例不存在')
    },
  },

  // ============================================================
  // 监控统计
  // ============================================================
  {
    url: '/api/approval/monitor/getSummary',
    method: 'GET',
    body: () => {
      const total = instanceDataSource.length
      const count = (status: ApprovalInstanceResp['status']) =>
        instanceDataSource.filter((item) => item.status === status).length
      const approved = count('approved')
      const rejected = count('rejected')
      const finished = approved + rejected
      const durations = instanceDataSource
        .map((item) => item.durationMs)
        .filter((value): value is number => typeof value === 'number')

      const summary: ApprovalMonitorSummary = {
        total,
        running: count('running'),
        pending: count('pending'),
        approved,
        rejected,
        timeout: count('timeout'),
        successRate: finished ? Math.round((approved / finished) * 100) : 0,
        averageDurationMs: durations.length
          ? Math.round(
              durations.reduce((totalValue, value) => totalValue + value, 0) /
                durations.length
            )
          : 0,
      }
      return apiOk(summary)
    },
  },
])
