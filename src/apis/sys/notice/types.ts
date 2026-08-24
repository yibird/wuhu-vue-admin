import type { BaseResp } from '#/http'

export type NoticeType = 1 | 2

export interface NoticeResp extends BaseResp {
  /**
   * @desc 通知标题
   */
  title: string
  /**
   * @desc 通知内容
   */
  content: string
  /**
   * @desc 通知类型(1通知,2公告)
   */
  type: NoticeType
  /**
   * @desc 排序
   */
  sort: number
  /**
   * @desc 状态(true正常,false停用)
   */
  status: boolean
}

export interface CreateNoticeReq {
  title: string
  content: string
  type: NoticeType
  sort: number
  status: boolean
  remark?: string
}

export interface UpdateNoticeReq extends Partial<CreateNoticeReq> {
  id: string
}
