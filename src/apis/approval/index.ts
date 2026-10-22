import { getBaseApi } from '@/apis/util'
import { apiRequest } from '@/utils'
import { REQUEST_METHOD } from '@/constants'

export type {
  ApprovalCategoryResp,
  ApprovalDefinitionQuery,
  ApprovalDefinitionResp,
  ApprovalDefinitionState,
  ApprovalInstanceQuery,
  ApprovalInstanceResp,
  ApprovalInstanceStatus,
  ApprovalInstanceStep,
  ApprovalInstanceStepStatus,
  ApprovalMonitorSummary,
  CreateApprovalCategoryReq,
  CreateApprovalDefinitionReq,
  UpdateApprovalCategoryReq,
  UpdateApprovalDefinitionReq,
} from './types'

import type { ApiResult } from '#/http'
import type {
  ApprovalCategoryResp,
  ApprovalDefinitionResp,
  ApprovalInstanceResp,
  ApprovalMonitorSummary,
  CreateApprovalCategoryReq,
  CreateApprovalDefinitionReq,
  UpdateApprovalCategoryReq,
  UpdateApprovalDefinitionReq,
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
    method: REQUEST_METHOD.POST,
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
    method: REQUEST_METHOD.POST,
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
    { method: REQUEST_METHOD.GET }
  )
}

/**
 * 创建审批分类
 * @param data 分类信息
 * @returns 分类 id
 */
export function createApprovalCategoryApi(data: CreateApprovalCategoryReq) {
  return apiRequest<Result<string>>('/approval/category/create', {
    method: REQUEST_METHOD.POST,
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
    method: REQUEST_METHOD.POST,
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
    method: REQUEST_METHOD.POST,
    json: ids,
  })
}

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
    { method: REQUEST_METHOD.GET }
  )
}
