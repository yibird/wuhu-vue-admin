import type { BaseResp } from '#/http'

export type NoticeType = 1 | 2
export type NoticeSendMode = 'immediate' | 'scheduled'

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
  /**
   * @desc 发送方式(immediate立即发送,scheduled定时发送)
   */
  sendMode: NoticeSendMode
  /**
   * @desc 定时发送时间
   */
  scheduledAt?: string
}

export interface CreateNoticeReq {
  title: string
  content: string
  type: NoticeType
  sort: number
  status: boolean
  sendMode: NoticeSendMode
  scheduledAt?: string
  remark?: string
}

export interface UpdateNoticeReq extends Partial<CreateNoticeReq> {
  id: string
}
