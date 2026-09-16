export {
  createRoleApi,
  deleteRoleApi,
  getRolePageListApi,
  getRoleRecordApi,
  updateRoleApi,
} from './role'
export type { CreateRoleReq, RoleResp, UpdateRoleReq } from './role/types'

export {
  createUserApi,
  deleteUserApi,
  getUserPageListApi,
  getUserRecordApi,
  updateUserApi,
} from './user'
export type { CreateUserReq, UpdateUserReq, UserResp } from './user/types'

export {
  createDeptApi,
  deleteDeptApi,
  getDeptPageListApi,
  getDeptRecordApi,
  updateDeptApi,
} from './dept'
export type { CreateDeptReq, DeptResp, UpdateDeptReq } from './dept/types'

export { getMenuPageListApi, getMenuRecordApi } from './menu'
export type { CreateMenuReq, MenuResp, UpdateMenuReq } from './menu/types'

export {
  createNoticeApi,
  getNoticePageListApi,
  getNoticeRecordApi,
} from './notice'
export type {
  CreateNoticeReq,
  NoticeResp,
  NoticeSendMode,
  NoticeType,
  UpdateNoticeReq,
} from './notice/types'

export {
  createDictApi,
  createDictItemApi,
  deleteDictApi,
  deleteDictItemApi,
  getDictItemPageListApi,
  getDictItemRecordApi,
  getDictPageListApi,
  getDictRecordApi,
  updateDictApi,
  updateDictItemApi,
} from './dict'
export type {
  CreateDictItemReq,
  CreateDictReq,
  DictItemQuery,
  DictItemResp,
  DictQuery,
  DictResp,
  UpdateDictItemReq,
  UpdateDictReq,
} from './dict/types'
