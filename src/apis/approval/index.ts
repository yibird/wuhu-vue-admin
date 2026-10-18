import { getBaseApi } from '@/apis/util'
import { apiRequest } from '@/utils'
import { RequestMethod } from '@/constants'

export type {
  ApprovalCategoryResp,
  ApprovalDefinitionQuery,
  ApprovalDefinitionResp,
  ApprovalDefinitionState,
  ApprovalGroupQuery,
  ApprovalGroupResp,
  ApprovalInstanceQuery,
  ApprovalInstanceResp,
  ApprovalInstanceStatus,
  ApprovalInstanceStep,
  ApprovalInstanceStepStatus,
  ApprovalMonitorSummary,
  CreateApprovalCategoryReq,
  CreateApprovalDefinitionReq,
  CreateApprovalGroupReq,
  UpdateApprovalCategoryReq,
  UpdateApprovalDefinitionReq,
  UpdateApprovalGroupReq,
} from './types'

import type { Result } from '#/http'
import type {
  ApprovalCategoryResp,
  ApprovalDefinitionResp,
  ApprovalGroupResp,
  ApprovalInstanceResp,
  ApprovalMonitorSummary,
  CreateApprovalCategoryReq,
  CreateApprovalDefinitionReq,
  CreateApprovalGroupReq,
  UpdateApprovalCategoryReq,
  UpdateApprovalDefinitionReq,
  UpdateApprovalGroupReq,
} from './types'

export const {
  getPageListApi: getApprovalDefinitionPageListApi,
  getRecordApi: getApprovalDefinitionRecordApi,
  createApi: createApprovalDefinitionApi,
  updateApi: updateApprovalDefinitionApi,
  deleteApi: deleteApprovalDefinitionApi,
} = getBaseApi<
  ApprovalDefinitionResp,
  ApprovalDefinitionResp,
  CreateApprovalDefinitionReq,
  UpdateApprovalDefinitionReq
>('/approval/definition')

/**
 * 发布审批流
 * @param id 审批流 id
 * @returns 审批流 id
 */
export function publishApprovalDefinitionApi(id: string) {
  return apiRequest<Result<string>>('/approval/definition/publish', {
    method: RequestMethod.POST,
    json: { id },
  })
}

/**
 * 复制审批流
 * @param id 审批流 id
 * @returns 新审批流 id
 */
export function duplicateApprovalDefinitionApi(id: string) {
  return apiRequest<Result<string>>('/approval/definition/duplicate', {
    method: RequestMethod.POST,
    json: { id },
  })
}

/**
 * 审批分类列表
 * @returns 分类列表
 */
export function getApprovalCategoryListApi() {
  return apiRequest<Result<ApprovalCategoryResp[]>>(
    '/approval/category/getList',
    { method: RequestMethod.GET }
  )
}

/**
 * 创建审批分类
 * @param data 分类信息
 * @returns 分类 id
 */
export function createApprovalCategoryApi(data: CreateApprovalCategoryReq) {
  return apiRequest<Result<string>>('/approval/category/create', {
    method: RequestMethod.POST,
    json: data,
  })
}

/**
 * 更新审批分类
 * @param data 分类信息
 * @returns 分类 id
 */
export function updateApprovalCategoryApi(data: UpdateApprovalCategoryReq) {
  return apiRequest<Result<string>>('/approval/category/update', {
    method: RequestMethod.POST,
    json: data,
  })
}

/**
 * 删除审批分类
 * @param ids 分类 id 列表
 * @returns 删除数量
 */
export function deleteApprovalCategoryApi(ids: Array<string | number>) {
  return apiRequest<Result<number>>('/approval/category/del', {
    method: RequestMethod.POST,
    json: ids,
  })
}

export const {
  getPageListApi: getApprovalGroupPageListApi,
  getRecordApi: getApprovalGroupRecordApi,
  createApi: createApprovalGroupApi,
  updateApi: updateApprovalGroupApi,
  deleteApi: deleteApprovalGroupApi,
} = getBaseApi<
  ApprovalGroupResp,
  ApprovalGroupResp,
  CreateApprovalGroupReq,
  UpdateApprovalGroupReq
>('/approval/group')

export const {
  getPageListApi: getApprovalInstancePageListApi,
  getRecordApi: getApprovalInstanceRecordApi,
} = getBaseApi<ApprovalInstanceResp, ApprovalInstanceResp>('/approval/instance')

/**
 * 审批实例监控统计
 * @returns 监控统计
 */
export function getApprovalMonitorSummaryApi() {
  return apiRequest<Result<ApprovalMonitorSummary>>(
    '/approval/monitor/getSummary',
    { method: RequestMethod.GET }
  )
}
