import { message } from 'antdv-next'
import { onBeforeUnmount, shallowRef } from 'vue'

const ACTION_MESSAGES: Record<string, string> = {
  重建索引: '索引重建任务已提交，预计 2 分钟完成',
  同步全部: '同步任务已启动，文档将在后台增量同步',
  质量扫描: '质量扫描完成，低质量分段已进入待处理队列',
  重建分段: '分段重建任务已提交，完成后将自动刷新',
  运行测试: '召回测试完成，已按当前参数刷新结果',
  保存样本: '已保存为召回测试样本',
  新增标注: '已新增标注样本',
  新增术语: '已新增术语',
  导出统计: '统计数据已导出',
  查看看板: '已打开数据看板',
  导出日志: '检索日志已导出',
  筛选异常: '已筛选出异常查询',
  保存设置: '知识库设置已保存',
  恢复默认: '已恢复默认设置',
}

const SLOW_ACTIONS = new Set(['重建索引', '同步全部', '质量扫描', '重建分段'])

const FILE_ACCEPT = '.pdf,.doc,.docx,.md,.txt,.csv,.xlsx'

export function useKnowledgeActions() {
  const runningAction = shallowRef<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  function runAction(action: string) {
    if (runningAction.value) return

    runningAction.value = action
    clearTimeout(timer)
    timer = setTimeout(
      () => {
        runningAction.value = null
        message.success(ACTION_MESSAGES[action] ?? `${action}已完成`)
      },
      SLOW_ACTIONS.has(action) ? 1200 : 700
    )
  }

  function pickFiles() {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = FILE_ACCEPT
    input.addEventListener('change', () => {
      const files = Array.from(input.files ?? [])
      if (!files.length) return

      message.success(
        files.length === 1
          ? `已选择「${files[0].name}」，正在导入`
          : `已选择 ${files.length} 个文件，正在导入`
      )
    })
    input.click()
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { runningAction, runAction, pickFiles }
}
