import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { LogStatus } from '@/apis'

/**
 * 日志时间格式化为 yyyy-MM-dd HH:mm:ss
 *
 * @param value ISO 时间
 */
export function formatLogTime(value?: string) {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

/**
 * 执行结果展示配置
 */
export const logStatusMeta: Record<
  LogStatus,
  {
    /**
     * @desc 结果名称
     */
    label: string
    /**
     * @desc 标签颜色
     */
    color: string
  }
> = {
  1: { label: '成功', color: 'success' },
  0: { label: '失败', color: 'error' },
}

/**
 * 取执行结果的展示配置
 *
 * 表格插槽里的 record 是 any,这里收敛一次类型并兜底未知值
 *
 * @param status 执行结果
 */
export function resolveLogStatusMeta(status: LogStatus) {
  return logStatusMeta[status] ?? logStatusMeta[0]
}

/**
 * 执行结果下拉选项
 */
export const logStatusOptions = (Object.keys(logStatusMeta) as string[]).map(
  (value) => ({
    label: logStatusMeta[Number(value) as LogStatus].label,
    value: Number(value),
  })
)

/**
 * 把查询表单里的日期区间拆成起止时间
 *
 * 起始取当天 00:00:00、结束取当天 23:59:59,避免用户选的当天被排除在外。
 *
 * @param range 日期区间
 */
export function resolveTimeRange(range: unknown) {
  const [start, end] = (range as [Dayjs, Dayjs] | undefined) ?? []

  return {
    startTime: start ? dayjs(start).startOf('day').toISOString() : undefined,
    endTime: end ? dayjs(end).endOf('day').toISOString() : undefined,
  }
}
