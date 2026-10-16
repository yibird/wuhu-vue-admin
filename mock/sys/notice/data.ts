import { faker } from '@faker-js/faker'
import type { CreateNoticeReq, NoticeResp, NoticeType } from '@/apis'

const noticeTitleTemplates = [
  '系统版本升级通知',
  '数据备份完成公告',
  '账号安全策略调整通知',
  '平台服务例行维护公告',
  '新版工作台功能上线公告',
  '接口调用限流规则调整通知',
  '组织架构同步完成通知',
  '移动端体验优化公告',
  '权限模型升级通知',
  '年度服务可用性报告公告',
]

const noticeContentTemplates = [
  '本次升级将于今晚 23:00 开始,预计持续 30 分钟,期间系统只读,请提前保存工作内容。',
  '备份任务已于今日凌晨执行完成,数据完整性与一致性校验均通过,无需人工干预。',
  '为提升账号安全性,后续将强制启用二次验证,请及时在「个人中心」完成绑定。',
  '维护窗口内管理后台会短暂不可用,业务接口不受影响,如遇异常请稍后重试。',
  '工作台新增自定义快捷入口能力,可在偏好设置中调整展示顺序与数量。',
  '单个应用每分钟调用上限调整为 3000 次,超限请求会返回 429,请做好重试与降级。',
  '本次同步覆盖全部部门与岗位数据,如发现归属异常请在部门管理中手动修正。',
  '移动端列表页加载速度提升约 40%,并修复了弱网环境下筛选条件丢失的问题。',
  '权限模型由角色维度升级为角色 + 菜单权限,历史角色已自动迁移,如有缺失请重新授权。',
  '过去一年服务可用性为 99.98%,详细数据与故障复盘已归档,可在监控中心查看。',
]

function createBase(id: string, sort: number) {
  const createdAt = faker.date.past({ years: 1 })
  return {
    id,
    dataStatus: true,
    deleted: false,
    version: 1,
    sort,
    createdBy: '系统管理员',
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  }
}

function createNotice(
  id: string,
  titleIndex: number,
  type: NoticeType,
  sort: number,
  status: boolean
): NoticeResp {
  const sendMode = type === 2 ? 'immediate' : 'scheduled'
  return {
    ...createBase(id, sort),
    title: noticeTitleTemplates[titleIndex % noticeTitleTemplates.length],
    content: noticeContentTemplates[titleIndex % noticeContentTemplates.length],
    type,
    sort,
    status,
    sendMode,
    scheduledAt:
      sendMode === 'scheduled'
        ? faker.date.future({ years: 1 }).toISOString()
        : undefined,
  }
}

export const noticeDataSource: NoticeResp[] = Array.from(
  { length: 46 },
  (_, index) =>
    createNotice(
      `${index + 1}`,
      index,
      index % 3 === 0 ? 2 : 1,
      index + 1,
      index % 7 !== 0
    )
)

export function appendNotice(input: CreateNoticeReq) {
  const notice: NoticeResp = {
    ...input,
    id: `${noticeDataSource.length + 1}`,
    dataStatus: true,
    deleted: false,
    createdBy: '系统管理员',
    version: 1,
    createdAt: new Date().toISOString(),
  }
  noticeDataSource.unshift(notice)
  return notice
}

export function findNotice(id: string) {
  return noticeDataSource.find((item) => item.id === id)
}
