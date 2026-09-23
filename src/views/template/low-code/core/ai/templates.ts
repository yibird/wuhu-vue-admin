import { compactNodes, makeNode } from './node'
import type { CreateNode } from './node'
import type { ComponentSchema, StyleSchema } from '../schema/types'

/**
 * 自然语言解析出的表单字段
 */
export interface AiField {
  /**
   * @desc 字段标识（表单 name / 表格 dataIndex）
   */
  key: string
  /**
   * @desc 字段中文名
   */
  label: string
  /**
   * @desc 物料类型
   */
  type: string
  /**
   * @desc 透传给物料的额外属性
   */
  props?: Record<string, unknown>
}

const PAGE_STYLE: StyleSchema = {
  layout: 'flex',
  direction: 'column',
  gap: 16,
  padding: '24px',
  minHeight: 900,
  background: '#f5f7fa',
}

const CARD_STYLE: StyleSchema = { width: '100%' }

function headerNodes(
  create: CreateNode,
  title: string,
  description: string,
  actions: Array<ComponentSchema | undefined> = []
) {
  return compactNodes([
    makeNode(create, 'Flex', {
      name: '标题区',
      style: {
        layout: 'flex',
        direction: 'row',
        justify: 'between',
        align: 'center',
        gap: 12,
      },
      children: compactNodes([
        makeNode(create, 'Flex', {
          name: '标题文本',
          style: { layout: 'flex', direction: 'column', gap: 4 },
          children: compactNodes([
            makeNode(create, 'Title', {
              props: { text: title, level: 3 },
            }),
            makeNode(create, 'Text', {
              props: { text: description, type: 'secondary' },
            }),
          ]),
        }),
        ...actions,
      ]),
    }),
  ])
}

function button(
  create: CreateNode,
  text: string,
  type: 'primary' | 'default' = 'primary'
) {
  return makeNode(create, 'Button', {
    name: text,
    props: { text, type, htmlType: 'button' },
  })
}

/**
 * 表单页：卡片 + 表单 + 字段
 */
export function createFormPageComponents(
  create: CreateNode,
  title: string,
  description: string,
  fields: AiField[]
): ComponentSchema[] {
  const items = compactNodes(
    fields.map((field) =>
      makeNode(create, 'FormItem', {
        name: field.label,
        props: { label: field.label, name: field.key, required: true },
        style: { width: '100%' },
        children: compactNodes([
          makeNode(create, field.type, {
            name: field.label,
            props: { ...field.props, name: field.key },
            style: { width: '100%' },
          }),
        ]),
      })
    )
  )

  const form = makeNode(create, 'Form', {
    name: '表单',
    style: { layout: 'flex', direction: 'column', gap: 16, padding: '16px' },
    props: { layout: 'vertical' },
    children: compactNodes([
      ...items,
      makeNode(create, 'Flex', {
        name: '操作区',
        style: { layout: 'flex', direction: 'row', justify: 'end', gap: 8 },
        children: compactNodes([
          button(create, '重置', 'default'),
          button(create, '提交'),
        ]),
      }),
    ]),
  })

  return compactNodes([
    makeNode(create, 'Flex', {
      name: '页面根容器',
      style: PAGE_STYLE,
      children: compactNodes([
        ...headerNodes(create, title, description),
        makeNode(create, 'Card', {
          name: '表单卡片',
          props: { title, bordered: true },
          style: CARD_STYLE,
          children: compactNodes([form]),
        }),
      ]),
    }),
  ])
}

/**
 * 列表页：卡片 + 表格（可选筛选区）
 */
export function createTablePageComponents(
  create: CreateNode,
  title: string,
  description: string,
  fields: AiField[],
  options: { filters?: AiField[] } = {}
): ComponentSchema[] {
  const filters = options.filters ?? []
  const filterRow = filters.length
    ? [
        makeNode(create, 'Card', {
          name: '筛选区',
          props: { title: '', bordered: true },
          style: CARD_STYLE,
          children: compactNodes([
            makeNode(create, 'Flex', {
              name: '筛选项',
              style: {
                layout: 'flex',
                direction: 'row',
                wrap: true,
                align: 'center',
                gap: 12,
              },
              children: compactNodes([
                ...filters.map((field) =>
                  makeNode(create, field.type, {
                    name: field.label,
                    props: {
                      ...field.props,
                      placeholder: `请输入${field.label}`,
                    },
                    style: { width: 220 },
                  })
                ),
                button(create, '查询'),
                button(create, '重置', 'default'),
              ]),
            }),
          ]),
        }),
      ]
    : []

  const table = makeNode(create, 'Table', {
    name: '数据表格',
    props: {
      columns: fields.map((field) => ({
        title: field.label,
        dataIndex: field.key,
        key: field.key,
      })),
      dataSource: fields.length
        ? [
            Object.fromEntries(
              fields.map((field, index) => [
                field.key,
                index === 0 ? `${field.label}示例一` : '示例值',
              ])
            ),
            Object.fromEntries(
              fields.map((field, index) => [
                field.key,
                index === 0 ? `${field.label}示例二` : '示例值',
              ])
            ),
          ]
        : [],
      rowKey: fields[0]?.key ?? 'id',
      pagination: true,
      bordered: false,
    },
    style: { width: '100%' },
  })

  return compactNodes([
    makeNode(create, 'Flex', {
      name: '页面根容器',
      style: PAGE_STYLE,
      children: compactNodes([
        ...headerNodes(create, title, description, [button(create, '新建')]),
        ...filterRow,
        makeNode(create, 'Card', {
          name: '列表卡片',
          props: { title, bordered: true },
          style: CARD_STYLE,
          children: compactNodes([table]),
        }),
      ]),
    }),
  ])
}

/**
 * 看板页：栅格指标卡 + 图表占位 + 说明
 */
export function createDashboardPageComponents(
  create: CreateNode,
  title: string,
  description: string,
  metrics: AiField[]
): ComponentSchema[] {
  const cards = metrics.map((metric) =>
    makeNode(create, 'Card', {
      name: metric.label,
      props: { title: metric.label, bordered: true },
      style: { width: '100%' },
      children: compactNodes([
        makeNode(create, 'Statistic', {
          name: metric.label,
          props: {
            title: metric.label,
            value: metric.props?.value ?? '12,800',
            suffix: metric.props?.suffix,
          },
          style: { width: '100%' },
        }),
      ]),
    })
  )

  return compactNodes([
    makeNode(create, 'Flex', {
      name: '页面根容器',
      style: PAGE_STYLE,
      children: compactNodes([
        ...headerNodes(create, title, description, [
          button(create, '刷新数据'),
        ]),
        makeNode(create, 'Grid', {
          name: '指标卡',
          style: { layout: 'grid', columns: 3, gap: 16 },
          children: compactNodes(cards),
        }),
        makeNode(create, 'Card', {
          name: '趋势卡片',
          props: { title: '趋势分析', bordered: true },
          style: CARD_STYLE,
          children: compactNodes([
            makeNode(create, 'Alert', {
              name: '说明',
              props: {
                message: 'AI 已生成指标骨架，可在物料中心补充图表组件',
                type: 'info',
                showIcon: true,
              },
              style: { width: '100%' },
            }),
          ]),
        }),
        makeNode(create, 'Card', {
          name: '明细卡片',
          props: { title: '数据明细', bordered: true },
          style: CARD_STYLE,
          children: compactNodes([
            makeNode(create, 'Table', {
              name: '数据明细',
              props: {
                columns: [
                  { title: '指标', dataIndex: 'metric', key: 'metric' },
                  { title: '数值', dataIndex: 'value', key: 'value' },
                  { title: '环比', dataIndex: 'ratio', key: 'ratio' },
                ],
                dataSource: metrics.map((metric, index) => ({
                  id: String(index + 1),
                  metric: metric.label,
                  value: String(metric.props?.value ?? '12,800'),
                  ratio: `${(index + 1) * 3.2}%`,
                })),
                rowKey: 'id',
                pagination: false,
              },
              style: { width: '100%' },
            }),
          ]),
        }),
      ]),
    }),
  ])
}

/**
 * 详情页：描述字段 + 表单只读展示
 */
export function createDetailPageComponents(
  create: CreateNode,
  title: string,
  description: string,
  fields: AiField[]
): ComponentSchema[] {
  const rows = fields.map((field) =>
    makeNode(create, 'FormItem', {
      name: field.label,
      props: { label: field.label },
      style: { width: '100%' },
      children: compactNodes([
        makeNode(create, 'Text', {
          name: field.label,
          props: { text: `\${${field.key}}`, type: 'regular' },
          style: { width: '100%' },
        }),
      ]),
    })
  )

  return compactNodes([
    makeNode(create, 'Flex', {
      name: '页面根容器',
      style: PAGE_STYLE,
      children: compactNodes([
        ...headerNodes(create, title, description, [button(create, '编辑')]),
        makeNode(create, 'Card', {
          name: '详情卡片',
          props: { title, bordered: true },
          style: CARD_STYLE,
          children: compactNodes([
            makeNode(create, 'Form', {
              name: '详情字段',
              style: {
                layout: 'flex',
                direction: 'column',
                gap: 12,
                padding: '8px',
              },
              props: { layout: 'vertical' },
              children: compactNodes(rows),
            }),
          ]),
        }),
      ]),
    }),
  ])
}
