import { computed, onBeforeUnmount, readonly, shallowRef } from 'vue'
import {
  aiSuggestions,
  chartDataSources,
  defaultScreenConfig,
  defaultWidgets,
  initialAiMessages,
} from '../data'
import {
  createAiMessage,
  createGeneratedWidgets,
  getAiScenario,
  getAiScenarioSourceId,
  getAiScenarioTitle,
  inferChartTypeFromPrompt,
  inferChartTypesFromPrompt,
} from './ai'
import { getNowLabel } from './ids'
import { createJsonSourceFromDraft } from './importJsonSource'
import { cloneDataSource, cloneWidget } from './schema'
import { useChartDataSourceActions } from './useDataSourceActions'
import { useChartSelectionActions } from './useSelectionActions'
import { useChartSchemaActions } from './useSchemaActions'
import { useChartWidgetActions } from './useWidgetActions'
import { clampIndex, createWidgetFromPalette } from './widgetFactory'
import type {
  ChartAiMessage,
  ChartPaletteItem,
  ChartScreenConfig,
} from '../types'

export function useChartDesigner() {
  const dataSources = shallowRef(chartDataSources.map(cloneDataSource))
  const widgets = shallowRef(defaultWidgets.map(cloneWidget))
  const screenConfig = shallowRef<ChartScreenConfig>({ ...defaultScreenConfig })
  const selectedWidgetIds = shallowRef<string[]>(
    widgets.value[0] ? [widgets.value[0].id] : []
  )
  const activeSourceId = shallowRef(dataSources.value[0]?.id ?? '')
  const aiPrompt = shallowRef('')
  const aiBusy = shallowRef(false)
  const jsonDraft = shallowRef('[{"date":"06-12","name":"示例","value":128}]')
  const aiMessages = shallowRef<ChartAiMessage[]>([...initialAiMessages])
  let aiTimer: number | undefined
  let disposed = false

  const sleepWithCleanup = (ms: number) =>
    new Promise<void>((resolve) => {
      aiTimer = window.setTimeout(resolve, ms)
    })

  onBeforeUnmount(() => {
    disposed = true
    if (aiTimer) window.clearTimeout(aiTimer)
  })

  const activeSource = computed(
    () =>
      dataSources.value.find((source) => source.id === activeSourceId.value) ??
      dataSources.value[0]
  )

  const selectedWidgetId = computed(() => selectedWidgetIds.value[0] ?? '')

  const selectedWidget = computed(() =>
    widgets.value.find((widget) => widget.id === selectedWidgetId.value)
  )

  const selectedSource = computed(() => {
    const widget = selectedWidget.value
    return dataSources.value.find((source) => source.id === widget?.sourceId)
  })

  const designerStats = computed(() => ({
    sourceCount: dataSources.value.length,
    widgetCount: widgets.value.length,
    onlineSourceCount: dataSources.value.filter(
      (source) => source.status === 'online'
    ).length,
    refreshLabel: screenConfig.value.autoRefresh ? '自动刷新' : '手动刷新',
  }))

  const selectedFields = computed(() => selectedSource.value?.fields ?? [])

  const { clearSelection, selectManyWidgets, selectWidget } =
    useChartSelectionActions({ selectedWidgetIds, widgets })
  const { selectDataSource, updateDataSource } = useChartDataSourceActions({
    activeSourceId,
    dataSources,
  })

  function updateScreenConfig(patch: Partial<ChartScreenConfig>) {
    screenConfig.value = {
      ...screenConfig.value,
      ...patch,
    }
  }

  function addWidget(
    item: ChartPaletteItem,
    insertIndex = widgets.value.length
  ) {
    const source = activeSource.value
    if (!source) return
    const widget = createWidgetFromPalette(item, source)
    const nextWidgets = [...widgets.value]
    nextWidgets.splice(clampIndex(insertIndex, nextWidgets.length), 0, widget)
    widgets.value = nextWidgets
    selectedWidgetIds.value = [widget.id]
  }

  const {
    duplicateSelectedWidgets,
    duplicateWidget,
    removeSelectedWidgets,
    removeWidget,
    reorderWidgets,
    updateWidget,
  } = useChartWidgetActions({ dataSources, selectedWidgetIds, widgets })
  const { copySchema, exportSchema, getSchemaText } = useChartSchemaActions({
    aiMessages,
    dataSources,
    screenConfig,
    widgets,
  })

  function importJsonSource() {
    let result: ReturnType<typeof createJsonSourceFromDraft>

    try {
      result = createJsonSourceFromDraft(jsonDraft.value, getNowLabel())
    } catch {
      aiMessages.value = [
        ...aiMessages.value,
        createAiMessage('assistant', 'JSON 解析失败，请检查是否为对象数组。'),
      ]
      return
    }

    if (!result) {
      aiMessages.value = [
        ...aiMessages.value,
        createAiMessage(
          'assistant',
          'JSON 需要是对象或对象数组，且字段值只能是文本、数字、布尔或空值。'
        ),
      ]
      return
    }

    dataSources.value = [result.source, ...dataSources.value]
    activeSourceId.value = result.source.id
    aiMessages.value = [
      ...aiMessages.value,
      createAiMessage(
        'assistant',
        `已导入 ${result.records.length} 条 JSON 数据，并完成字段识别。`
      ),
    ]
  }

  async function generateFromPrompt(prompt = aiPrompt.value) {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || aiBusy.value) return

    aiBusy.value = true
    aiMessages.value = [
      ...aiMessages.value,
      createAiMessage('user', trimmedPrompt),
    ]

    await sleepWithCleanup(460)
    if (disposed) return

    const scenario = getAiScenario(trimmedPrompt)
    const generatedWidgets = createGeneratedWidgets(
      scenario,
      inferChartTypesFromPrompt(trimmedPrompt)
    )
    const targetSourceId = getAiScenarioSourceId(scenario)

    widgets.value = generatedWidgets
    activeSourceId.value = targetSourceId
    selectedWidgetIds.value = generatedWidgets[0]
      ? [generatedWidgets[0].id]
      : []
    screenConfig.value = {
      ...screenConfig.value,
      title: getAiScenarioTitle(scenario),
      subtitle: trimmedPrompt,
    }
    aiMessages.value = [
      ...aiMessages.value,
      createAiMessage(
        'assistant',
        `已生成 ${generatedWidgets.length} 个大屏组件，并绑定 ${dataSources.value.find((source) => source.id === targetSourceId)?.name ?? '默认数据源'}。你可以继续让我“增加环比指标”或在右侧手动调整。`
      ),
    ]
    aiPrompt.value = ''
    aiBusy.value = false
  }

  function applySuggestion(prompt: string) {
    aiPrompt.value = prompt
    void generateFromPrompt(prompt)
  }

  async function applyAiToSelectedWidget(prompt = aiPrompt.value) {
    const trimmedPrompt = prompt.trim()
    const widget = selectedWidget.value

    if (!trimmedPrompt || aiBusy.value) return

    if (!widget) {
      aiMessages.value = [
        ...aiMessages.value,
        createAiMessage('assistant', '请先选中一个组件，再让我优化它的配置。'),
      ]
      return
    }

    aiBusy.value = true
    aiMessages.value = [
      ...aiMessages.value,
      createAiMessage('user', `优化选中组件：${trimmedPrompt}`),
    ]

    await sleepWithCleanup(360)
    if (disposed) return

    const nextChartType =
      widget.kind === 'chart'
        ? inferChartTypeFromPrompt(trimmedPrompt)
        : undefined
    updateWidget(widget.id, {
      chartType: nextChartType ?? widget.chartType,
      insight: `AI 已根据“${trimmedPrompt}”优化当前组件：保留数据绑定，并更新展示重点。`,
      title:
        trimmedPrompt.length > 14
          ? `${trimmedPrompt.slice(0, 14)}...`
          : trimmedPrompt,
    })
    aiMessages.value = [
      ...aiMessages.value,
      createAiMessage(
        'assistant',
        `已只更新“${widget.title}”的配置，没有替换整个大屏。`
      ),
    ]
    aiPrompt.value = ''
    aiBusy.value = false
  }

  return {
    aiBusy: readonly(aiBusy),
    aiMessages: readonly(aiMessages),
    aiPrompt,
    aiSuggestions,
    activeSource,
    activeSourceId,
    dataSources,
    designerStats,
    jsonDraft,
    screenConfig,
    selectedFields,
    selectedSource,
    selectedWidget,
    selectedWidgetId,
    selectedWidgetIds: readonly(selectedWidgetIds),
    widgets,
    addWidget,
    applyAiToSelectedWidget,
    applySuggestion,
    clearSelection,
    copySchema,
    duplicateSelectedWidgets,
    duplicateWidget,
    exportSchema,
    generateFromPrompt,
    getSchemaText,
    importJsonSource,
    removeSelectedWidgets,
    removeWidget,
    reorderWidgets,
    selectDataSource,
    selectManyWidgets,
    selectWidget,
    updateDataSource,
    updateScreenConfig,
    updateWidget,
  }
}
