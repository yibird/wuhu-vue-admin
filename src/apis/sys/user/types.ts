import type { BaseResp } from '#/http'

export interface UserResp extends BaseResp {
  /**
   * @desc 角色名称
   */
  username: string
  /**
   * @desc 昵称
   */
  nickname: string
  /**
   * @desc 真实姓名
   */
  realname: string
  /**
   * @desc 小头像
   */
  small_avatar?: string
  /**
   * @desc 大头像
   */
  big_avatar?: string
  /**
   * @desc 性别(0:男,1:女,2:未知)
   */
  sex: number
  /**
   * @desc 年龄
   */
  age: number
  /**
   * @desc 手机号
   */
  phone: string
  /**
   * @desc 邮箱
   */
  email: string
  /**
   * @desc 地址
   */
  address: string
  /**
   * @desc 生日
   */
  birthday?: string
  /**
   * @desc 学历(0:高中,1:大专,2:本科,3:硕士,4:博士)
   */
  education: number
  /**
   * @desc 工作经验(0:无,1:1年,2:2年,3:3年,4:4年,5:5年以上)
   */
  work_experience: number
  /**
   * @desc 婚姻状态(0:未婚,1:已婚,2:离异,3:丧偶)
   */
  marital_status: number
  /**
   * @desc 用户来源(0:注册,1:导入,2:第三方登录)
   */
  source: number
}

export interface CreateUserReq {}

export interface UpdateUserReq {
  id: string
}
