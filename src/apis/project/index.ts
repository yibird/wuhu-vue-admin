import { getBaseApi } from '@/apis/util'
import { apiRequest } from '@/utils'
import { HTTP_METHOD } from '@/constants'

import type { ApiResult } from '#/http'
import type {
  CreateMilestoneReq,
  CreateProjectMemberReq,
  CreateProjectReq,
  CreateProjectTaskReq,
  MilestoneResp,
  ProjectMemberResp,
  ProjectOption,
  ProjectResp,
  ProjectSummary,
  ProjectTaskResp,
  UpdateMilestoneReq,
  UpdateProjectMemberReq,
  UpdateProjectReq,
  UpdateProjectTaskReq,
} from './types'

export const {
  getPageListApi: getProjectPageListApi,
  getRecordApi: getProjectRecordApi,
  createApi: createProjectApi,
  updateApi: updateProjectApi,
  deleteApi: deleteProjectApi,
} = getBaseApi<ProjectResp, ProjectResp, CreateProjectReq, UpdateProjectReq>(
  '/project/project'
)

export const {
  getPageListApi: getProjectTaskPageListApi,
  getRecordApi: getProjectTaskRecordApi,
  createApi: createProjectTaskApi,
  updateApi: updateProjectTaskApi,
  deleteApi: deleteProjectTaskApi,
} = getBaseApi<
  ProjectTaskResp,
  ProjectTaskResp,
  CreateProjectTaskReq,
  UpdateProjectTaskReq
>('/project/task')

export const {
  getPageListApi: getMilestonePageListApi,
  getRecordApi: getMilestoneRecordApi,
  createApi: createMilestoneApi,
  updateApi: updateMilestoneApi,
  deleteApi: deleteMilestoneApi,
} = getBaseApi<
  MilestoneResp,
  MilestoneResp,
  CreateMilestoneReq,
  UpdateMilestoneReq
>('/project/milestone')

export const {
  getPageListApi: getProjectMemberPageListApi,
  getRecordApi: getProjectMemberRecordApi,
  createApi: createProjectMemberApi,
  updateApi: updateProjectMemberApi,
  deleteApi: deleteProjectMemberApi,
} = getBaseApi<
  ProjectMemberResp,
  ProjectMemberResp,
  CreateProjectMemberReq,
  UpdateProjectMemberReq
>('/project/member')

/**
 * 项目概览统计
 */
export function getProjectSummaryApi() {
  return apiRequest<ApiResult<ProjectSummary>>('/project/project/getSummary', {
    method: HTTP_METHOD.Get,
  })
}

/**
 * 项目下拉选项(表单与筛选共用)
 */
export function getProjectOptionsApi() {
  return apiRequest<ApiResult<ProjectOption[]>>('/project/project/getOptions', {
    method: HTTP_METHOD.Get,
  })
}

export type * from './types'
