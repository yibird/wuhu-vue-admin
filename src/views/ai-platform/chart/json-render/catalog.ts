import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/vue/schema'
import { z } from 'zod'

import type { ChartType } from '@/views/template/chart-designer/types'

/**
 * 与 chart-designer 引擎支持的类型保持一致,新增图表类型时两处需同步。
 */
export const CHART_TYPES = [
  'area',
  'line',
  'bar',
  'pie',
  'funnel',
  'scatter',
  'radar',
  'gauge',
  'heatmap',
  'treemap',
  'sunburst',
  'boxplot',
  'candlestick',
  'graph',
  'pictorialBar',
  'sankey',
] as const satisfies readonly ChartType[]

export type AiChartType = (typeof CHART_TYPES)[number]

/**
 * 图表数据行,label 为类目、value 为数值。
 */
const chartRowsSchema = z.array(
  z.object({
    label: z.string(),
    value: z.number(),
  })
)

/**
 * 生成式 UI 的组件与动作清单。
 * 该 catalog 同时用于渲染注册表和 system prompt 生成,保证模型可用的组件与前端渲染能力一致。
 */
export const catalog = defineCatalog(schema, {
  components: {
    Card: {
      props: z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
      }),
      slots: ['default'],
      description: '卡片容器,可带标题,用于分组承载子组件',
    },
    Grid: {
      props: z.object({
        columns: z.number().int().min(1).max(4).default(2),
        gap: z.number().default(12),
      }),
      slots: ['default'],
      description: '多列网格布局,列数 1-4',
    },
    Heading: {
      props: z.object({
        text: z.string(),
        level: z.number().int().min(1).max(4).default(2),
      }),
      description: '标题文本,level 1-4 对应不同字号',
    },
    Text: {
      props: z.object({ content: z.string() }),
      description: '正文段落',
    },
    Stat: {
      props: z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
        trend: z.string().optional(),
        formatter: z.enum(['number', 'currency', 'percent']).optional(),
      }),
      description: '单一指标卡,formatter 控制数值格式化方式',
    },
    Table: {
      props: z.object({
        columns: z.array(z.string()),
        rows: z.array(z.array(z.union([z.string(), z.number()]))),
      }),
      description: '简单表格,rows 每行长度需与 columns 一致',
    },
    Chart: {
      props: z.object({
        type: z.enum([...CHART_TYPES]),
        title: z.string().optional(),
        height: z.number().default(280),
        rows: chartRowsSchema,
      }),
      description: '图表,rows 为 类目-数值 数组',
    },
    Button: {
      props: z.object({ label: z.string() }),
      description: '按钮,press 事件可绑定 ask 动作向 Agent 发起追问',
    },
  },
  actions: {
    ask: {
      params: z.object({ prompt: z.string() }),
      description: '向 Agent 发送一条追问',
    },
  },
})
