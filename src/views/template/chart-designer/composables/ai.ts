import { defaultWidgets } from '../data'
import type { ChartAiMessage, ChartType, ChartWidget } from '../types'
import { createGrowthWidgets, createOpsWidgets } from './aiTemplates'
import { createDesignerId, getNowLabel } from './ids'
import { cloneWidget } from './schema'

type AiScenario = 'growth' | 'ops' | 'sales'

const chartTypeLabels: Record<ChartType, string> = {
  area: '趋势面积图',
  bar: '排行柱状图',
  boxplot: '箱线图',
  candlestick: 'K线图',
  funnel: '转化漏斗',
  gauge: '仪表盘',
  graph: '关系图',
  heatmap: '热力图',
  line: '折线趋势',
  pictorialBar: '象形柱图',
  pie: '占比环图',
  radar: '雷达对比',
  sankey: '桑基图',
  scatter: '散点分布',
  sunburst: '旭日图',
  treemap: '矩形树图',
}

const chartTypeMatchers: Array<{
  readonly type: ChartType
  readonly pattern: RegExp
}> = [
  { type: 'sankey', pattern: /桑基|流向|流量|sankey/ },
  { type: 'sunburst', pattern: /旭日|层级占比|sunburst/ },
  { type: 'treemap', pattern: /矩形树图|树图|资源分布|treemap/ },
  { type: 'boxplot', pattern: /箱线|分布区间|异常值|boxplot/ },
  { type: 'candlestick', pattern: /k线|蜡烛|开盘|收盘|candlestick/ },
  { type: 'graph', pattern: /关系图|拓扑|链路|关系网络|graph/ },
  { type: 'pictorialBar', pattern: /象形|图标柱|pictorial/ },
  { type: 'radar', pattern: /雷达|画像|能力|radar/ },
  { type: 'scatter', pattern: /散点|分布|异常点|scatter/ },
  { type: 'gauge', pattern: /仪表|达成率|健康度|gauge/ },
  { type: 'heatmap', pattern: /热力|热度|密度|heatmap/ },
  { type: 'funnel', pattern: /漏斗|转化|funnel/ },
  { type: 'pie', pattern: /占比|环图|饼图|pie/ },
  { type: 'bar', pattern: /排行|柱状|bar/ },
  { type: 'line', pattern: /折线|趋势|line/ },
  { type: 'area', pattern: /面积|area/ },
]

export function createAiMessage(role: ChartAiMessage['role'], content: string) {
  return {
    content,
    createdAt: getNowLabel(),
    id: createDesignerId(`message-${role}`),
    role,
  }
}

export function getAiScenario(prompt: string): AiScenario {
  const normalizedPrompt = prompt.toLowerCase()

  if (/监控|告警|cpu|接口|系统|服务|ops/.test(normalizedPrompt)) {
    return 'ops'
  }

  if (/增长|转化|漏斗|线索|商机|试用/.test(normalizedPrompt)) {
    return 'growth'
  }

  return 'sales'
}

export function getAiScenarioSourceId(scenario: AiScenario) {
  if (scenario === 'ops') return 'ops'
  if (scenario === 'growth') return 'growth'

  return 'sales'
}

export function getAiScenarioTitle(scenario: AiScenario) {
  if (scenario === 'ops') return 'AI 系统监控大屏'
  if (scenario === 'growth') return 'AI 增长转化大屏'

  return 'AI 销售经营大屏'
}

export function inferChartTypeFromPrompt(
  prompt: string
): ChartType | undefined {
  return inferChartTypesFromPrompt(prompt)[0]
}

export function inferChartTypesFromPrompt(
  prompt: string
): readonly ChartType[] {
  const normalizedPrompt = prompt.toLowerCase()
  const matchedTypes = chartTypeMatchers
    .filter((matcher) => matcher.pattern.test(normalizedPrompt))
    .map((matcher) => matcher.type)

  return Array.from(new Set(matchedTypes))
}

export function createGeneratedWidgets(
  scenario: AiScenario,
  requestedTypes: readonly ChartType[]
): ChartWidget[] {
  const widgets =
    scenario === 'ops'
      ? createOpsWidgets()
      : scenario === 'growth'
        ? createGrowthWidgets()
        : defaultWidgets.map(cloneWidget)

  return applyRequestedChartTypes(widgets, requestedTypes)
}

function applyRequestedChartTypes(
  widgets: ChartWidget[],
  requestedTypes: readonly ChartType[]
) {
  if (requestedTypes.length === 0) return widgets

  const chartIndexes = widgets
    .map((widget, index) => ({ index, widget }))
    .filter((item) => item.widget.kind === 'chart')
    .map((item) => item.index)

  return widgets.map((widget, index) => {
    const requestedIndex = chartIndexes.indexOf(index)
    const requestedType = requestedTypes[requestedIndex]
    if (widget.kind !== 'chart' || !requestedType) return widget

    return {
      ...widget,
      chartType: requestedType,
      title: chartTypeLabels[requestedType],
      insight: `AI 已按提示切换为${chartTypeLabels[requestedType]}，保留当前数据源和字段映射。`,
    }
  })
}
