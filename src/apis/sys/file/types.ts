import type { BaseModel } from '#/http'

/**
 * 文件分类
 */
export type FileKind =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'other'

/**
 * 文件记录
 */
export interface SysFile extends BaseModel {
  /**
   * @desc 文件名(含扩展名)
   */
  name: string
  /**
   * @desc 访问地址
   */
  url: string
  /**
   * @desc 文件 MIME 类型
   */
  mimeType: string
  /**
   * @desc 文件大小(字节)
   */
  size: number
  /**
   * @desc 文件分类
   */
  kind: FileKind
}

/**
 * 文件列表查询参数
 */
export interface SysFileQuery {
  /**
   * @desc 页码
   */
  current: number
  /**
   * @desc 每页条数
   */
  pageSize: number
  /**
   * @desc 文件名关键字
   */
  name?: string
  /**
   * @desc 文件分类
   */
  kind?: FileKind
  /**
   * @desc 上传时间范围起始
   */
  startTime?: string
  /**
   * @desc 上传时间范围结束
   */
  endTime?: string
}

/**
 * 新增文件请求
 */
export interface SysFileCreateReq {
  /**
   * @desc 文件名(含扩展名)
   */
  name: string
  /**
   * @desc 访问地址
   */
  url: string
  /**
   * @desc 文件 MIME 类型
   */
  mimeType: string
  /**
   * @desc 文件大小(字节)
   */
  size: number
  /**
   * @desc 文件分类
   */
  kind: FileKind
  /**
   * @desc 上传人,不传时由服务端取当前登录用户
   */
  createdBy?: string
  /**
   * @desc 备注
   */
  remark?: string
}

/**
 * 更新文件请求
 */
export interface SysFileUpdateReq extends Partial<SysFileCreateReq> {
  /**
   * @desc 文件主键
   */
  id: string
}
