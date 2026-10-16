import type { Ref } from 'vue'
import type {
  ChartAiMessage,
  ChartDataSource,
  ChartScreenConfig,
  ChartWidget,
} from '../types'
import { createAiMessage } from './ai'
import { createSchema } from './schema'

interface UseChartSchemaActionsOptions {
  aiMessages: Ref<ChartAiMessage[]>
  dataSources: Ref<ChartDataSource[]>
  screenConfig: Ref<ChartScreenConfig>
  widgets: Ref<ChartWidget[]>
}

export function useChartSchemaActions(options: UseChartSchemaActionsOptions) {
  function getSchemaText() {
    return JSON.stringify(
      createSchema(
        options.screenConfig.value,
        options.dataSources.value,
        options.widgets.value
      ),
      null,
      2
    )
  }

  async function copySchema() {
    try {
      await navigator.clipboard?.writeText(getSchemaText())
    } catch {
      options.aiMessages.value = [
        ...options.aiMessages.value,
        createAiMessage('assistant', '复制失败，请检查浏览器剪贴板权限。'),
      ]
      return
    }

    options.aiMessages.value = [
      ...options.aiMessages.value,
      createAiMessage(
        'assistant',
        '已复制当前大屏 Schema，可交给后端保存或接入发布流程。'
      ),
    ]
  }

  function exportSchema() {
    const blob = new Blob([getSchemaText()], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'chart-designer-schema.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return { copySchema, exportSchema, getSchemaText }
}
