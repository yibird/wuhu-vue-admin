import { getBaseApi } from '@/apis/util'
import { apiRequest } from '@/utils'
import { HTTP_METHOD } from '@/constants'

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
  return apiRequest<ApiResult<string>>('/approval/definition/publish', {
    method: HTTP_METHOD.Post,
    json: { id },
  })
}

/**
 * 复制审批流
 * @param id 审批流 id
 * @returns 新审批流 id
 */
export function duplicateApprovalDefinitionApi(id: string) {
  return apiRequest<ApiResult<string>>('/approval/definition/duplicate', {
    method: HTTP_METHOD.Post,
    json: { id },
  })
}

/**
 * 审批分类列表
 * @returns 分类列表
 */
export function getApprovalCategoryListApi() {
  return apiRequest<ApiResult<ApprovalCategoryResp[]>>(
    '/approval/category/getList',
    { method: HTTP_METHOD.Get }
  )
}

/**
 * 创建审批分类
 * @param data 分类信息
 * @returns 分类 id
 */
export function createApprovalCategoryApi(data: CreateApprovalCategoryReq) {
  return apiRequest<ApiResult<string>>('/approval/category/create', {
    method: HTTP_METHOD.Post,
    json: data,
  })
}

/**
 * 更新审批分类
 * @param data 分类信息
 * @returns 分类 id
 */
export function updateApprovalCategoryApi(data: UpdateApprovalCategoryReq) {
  return apiRequest<ApiResult<string>>('/approval/category/update', {
    method: HTTP_METHOD.Post,
    json: data,
  })
}

/**
 * 删除审批分类
 * @param ids 分类 id 列表
 * @returns 删除数量
 */
export function deleteApprovalCategoryApi(ids: Array<string | number>) {
  return apiRequest<ApiResult<number>>('/approval/category/del', {
    method: HTTP_METHOD.Post,
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
  return apiRequest<ApiResult<ApprovalMonitorSummary>>(
    '/approval/monitor/getSummary',
    { method: HTTP_METHOD.Get }
  )
}
