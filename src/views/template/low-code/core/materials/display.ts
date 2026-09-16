import {
  Alert,
  Avatar,
  Badge,
  Divider,
  Empty,
  Image,
  Progress,
  Statistic,
  Tag,
  TypographyParagraph,
  TypographyText,
  TypographyTitle,
} from 'antdv-next'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import type { Component } from 'vue'
import {
  colorField,
  columnsField,
  jsonField,
  numberField,
  selectField,
  switchField,
  textField,
  textareaField,
} from './helpers'
import type { ComponentDefinition } from '../schema/types'

function forward(name: string, component: Component) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(component, attrs, slots)
    },
  })
}

/** 文本类组件：text prop 渲染进默认插槽 */
function textForward(name: string, component: Component) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      text: { type: [String, Number], default: '' },
      level: { type: [Number, String], default: undefined },
      ellipsis: { type: [Boolean, Object], default: false },
      ellipsisRows: { type: Number, default: undefined },
    },
    setup(props, { attrs }) {
      return () => {
        const extra: Record<string, unknown> = {}
        if (props.level !== undefined) extra.level = props.level
        if (props.ellipsis) {
          extra.ellipsis = props.ellipsisRows
            ? { rows: props.ellipsisRows }
            : true
        }
        return h(
          component,
          { ...attrs, ...extra },
          {
            default: () => props.text,
          }
        )
      }
    },
  })
}

/** 内容型组件：text prop 渲染进默认插槽（如 Tag） */
function slotTextForward(name: string, component: Component) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: { text: { type: [String, Number], default: '' } },
    setup(props, { attrs }) {
      return () =>
        h(component, attrs, {
          default: () => props.text,
        })
    },
  })
}

const ImageRenderer = forward('LcImage', Image)

const AvatarRenderer = defineComponent({
  name: 'LcAvatar',
  inheritAttrs: false,
  props: { text: { type: String, default: '' } },
  setup(props, { attrs }) {
    return () =>
      h(Avatar, attrs, {
        default: () => (attrs.src ? undefined : props.text),
      })
  },
})

const TagRenderer = slotTextForward('LcTag', Tag)
const BadgeRenderer = forward('LcBadge', Badge)

const TextRenderer = textForward('LcText', TypographyText)
const TitleRenderer = textForward('LcTitle', TypographyTitle)
const ParagraphRenderer = textForward('LcParagraph', TypographyParagraph)
const AlertRenderer = forward('LcAlert', Alert)
const ProgressRenderer = forward('LcProgress', Progress)
const StatisticRenderer = forward('LcStatistic', Statistic)
const DividerRenderer = forward('LcDivider', Divider)
const EmptyRenderer = forward('LcEmpty', Empty)

const TableRenderer = defineAsyncComponent(async () => {
  const module = await import('antdv-next')
  return forward('LcTable', module.Table)
})

export const displayMaterialDefinitions: ComponentDefinition[] = [
  {
    type: 'Text',
    title: '文本',
    description: '行内文本展示',
    category: '展示',
    icon: 'i-lucide:type',
    kind: 0,
    props: [
      textareaField('text', '文本内容'),
      selectField('type', '语义类型', [
        { label: '默认', value: 'default' },
        { label: '次要', value: 'secondary' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '危险', value: 'danger' },
      ]),
      switchField('strong', '加粗'),
      switchField('italic', '斜体'),
      switchField('underline', '下划线'),
      switchField('delete', '删除线'),
    ],
    events: [{ name: 'click', label: '点击' }],
    defaultProps: { text: '文本内容', type: 'default', strong: false },
    defaultStyle: { width: 'auto' },
    renderer: TextRenderer,
  },
  {
    type: 'Title',
    title: '标题',
    description: '分级标题',
    category: '展示',
    icon: 'i-lucide:heading',
    kind: 0,
    props: [
      textareaField('text', '标题内容'),
      numberField('level', '标题级别', { min: 1, max: 5, defaultValue: 3 }),
    ],
    events: [],
    defaultProps: { text: '标题内容', level: 3 },
    defaultStyle: { width: '100%' },
    renderer: TitleRenderer,
  },
  {
    type: 'Paragraph',
    title: '段落',
    description: '多行文本段落',
    category: '展示',
    icon: 'i-lucide:pilcrow',
    kind: 0,
    props: [
      textareaField('text', '段落内容'),
      switchField('ellipsis', '超出省略'),
      numberField('ellipsisRows', '省略行数', { min: 1, max: 10 }),
    ],
    events: [],
    defaultProps: { text: '这是一段描述文本。', ellipsis: false },
    defaultStyle: { width: '100%' },
    renderer: ParagraphRenderer,
  },
  {
    type: 'Image',
    title: '图片',
    description: '图片展示与预览',
    category: '展示',
    icon: 'i-lucide:image',
    kind: 0,
    props: [
      textField('src', '图片地址'),
      textField('alt', '替代文本'),
      numberField('width', '宽度', { min: 0 }),
      numberField('height', '高度', { min: 0 }),
      switchField('preview', '允许预览'),
      switchField('fallback', '加载失败占位'),
    ],
    events: [],
    defaultProps: {
      src: 'https://picsum.photos/seed/wuhu/640/360',
      alt: '图片',
      preview: true,
      fallback: false,
    },
    defaultStyle: { width: 'auto' },
    renderer: ImageRenderer,
  },
  {
    type: 'Avatar',
    title: '头像',
    description: '用户/图标头像',
    category: '展示',
    icon: 'i-lucide:circle-user',
    kind: 0,
    props: [
      textField('src', '头像地址'),
      textField('text', '文字头像'),
      selectField('shape', '形状', [
        { label: '圆形', value: 'circle' },
        { label: '方形', value: 'square' },
      ]),
      numberField('size', '尺寸', { min: 16, max: 200, defaultValue: 40 }),
    ],
    events: [],
    defaultProps: { shape: 'circle', size: 40, text: 'W' },
    defaultStyle: { width: 'auto' },
    renderer: AvatarRenderer,
  },
  {
    type: 'Tag',
    title: '标签',
    description: '状态与分类标签',
    category: '展示',
    icon: 'i-lucide:tag',
    kind: 0,
    props: [
      textField('text', '标签内容'),
      selectField('color', '颜色', [
        { label: '默认', value: 'default' },
        { label: '处理中', value: 'processing' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '错误', value: 'error' },
      ]),
      switchField('closable', '可关闭'),
    ],
    events: [{ name: 'close', label: '关闭' }],
    defaultProps: { text: '标签', color: 'processing', closable: false },
    defaultStyle: { width: 'auto' },
    renderer: TagRenderer,
  },
  {
    type: 'Badge',
    title: '徽标',
    description: '数量与状态徽标',
    category: '展示',
    icon: 'i-lucide:badge',
    kind: 0,
    props: [
      textField('text', '展示文本'),
      numberField('count', '数量', { min: 0 }),
      selectField('status', '状态点', [
        { label: '无', value: '' },
        { label: '成功', value: 'success' },
        { label: '处理中', value: 'processing' },
        { label: '默认', value: 'default' },
        { label: '错误', value: 'error' },
        { label: '警告', value: 'warning' },
      ]),
      colorField('color', '颜色'),
    ],
    events: [],
    defaultProps: { text: '内容', count: 5, status: '' },
    defaultStyle: { width: 'auto' },
    renderer: BadgeRenderer,
  },
  {
    type: 'Alert',
    title: '提示',
    description: '信息提示条',
    category: '展示',
    icon: 'i-lucide:message-square-warning',
    kind: 0,
    props: [
      textField('message', '提示内容'),
      textField('description', '详细描述'),
      selectField('type', '类型', [
        { label: '信息', value: 'info' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '错误', value: 'error' },
      ]),
      switchField('showIcon', '显示图标'),
      switchField('banner', '横幅样式'),
      switchField('closable', '可关闭'),
    ],
    events: [{ name: 'close', label: '关闭' }],
    defaultProps: {
      message: '提示信息',
      description: '',
      type: 'info',
      showIcon: true,
      banner: false,
      closable: false,
    },
    defaultStyle: { width: '100%' },
    renderer: AlertRenderer,
  },
  {
    type: 'Progress',
    title: '进度条',
    description: '进度与完成度',
    category: '展示',
    icon: 'i-lucide:loader-circle',
    kind: 0,
    props: [
      numberField('percent', '进度百分比', {
        min: 0,
        max: 100,
        defaultValue: 60,
      }),
      selectField('type', '类型', [
        { label: '线形', value: 'line' },
        { label: '圆形', value: 'circle' },
        { label: '仪表盘', value: 'dashboard' },
      ]),
      selectField('status', '状态', [
        { label: '默认', value: 'normal' },
        { label: '进行中', value: 'active' },
        { label: '成功', value: 'success' },
        { label: '异常', value: 'exception' },
      ]),
      colorField('strokeColor', '进度颜色'),
      numberField('strokeWidth', '线宽', { min: 1, max: 30 }),
    ],
    events: [],
    defaultProps: { percent: 60, type: 'line', status: 'normal' },
    defaultStyle: { width: '100%' },
    renderer: ProgressRenderer,
  },
  {
    type: 'Statistic',
    title: '统计数值',
    description: '指标卡数值展示',
    category: '展示',
    icon: 'i-lucide:sigma',
    kind: 0,
    props: [
      textField('title', '标题'),
      textField('value', '数值'),
      numberField('precision', '小数位', { min: 0, max: 6 }),
      textField('prefix', '前缀'),
      textField('suffix', '后缀'),
    ],
    events: [],
    defaultProps: { title: '总用户数', value: '12,800', precision: 0 },
    defaultStyle: { width: '100%' },
    renderer: StatisticRenderer,
  },
  {
    type: 'Divider',
    title: '分割线',
    description: '内容区分割',
    category: '展示',
    icon: 'i-lucide:minus',
    kind: 0,
    props: [
      selectField('orientation', '方向', [
        { label: '水平', value: 'horizontal' },
        { label: '垂直', value: 'vertical' },
      ]),
      selectField('titlePlacement', '文字位置', [
        { label: '左', value: 'left' },
        { label: '中', value: 'center' },
        { label: '右', value: 'right' },
      ]),
      textField('text', '分割文案'),
      switchField('dashed', '虚线'),
    ],
    events: [],
    defaultProps: {
      orientation: 'horizontal',
      titlePlacement: 'center',
      dashed: false,
    },
    defaultStyle: { width: '100%' },
    renderer: DividerRenderer,
  },
  {
    type: 'Empty',
    title: '空状态',
    description: '无数据占位',
    category: '展示',
    icon: 'i-lucide:package-open',
    kind: 0,
    props: [textField('description', '描述文案')],
    events: [],
    defaultProps: { description: '暂无数据' },
    defaultStyle: { width: '100%', padding: '24px' },
    renderer: EmptyRenderer,
  },
  {
    type: 'Table',
    title: '表格',
    description: '数据表格，支持列配置与分页',
    category: '数据展示',
    icon: 'i-lucide:table',
    kind: 0,
    props: [
      columnsField(),
      jsonField('dataSource', '数据源', {
        description: '静态数组，或使用表达式绑定查询结果',
      }),
      textField('rowKey', '行键', { defaultValue: 'id' }),
      selectField('size', '尺寸', [
        { label: '默认', value: 'large' },
        { label: '中等', value: 'middle' },
        { label: '紧凑', value: 'small' },
      ]),
      switchField('bordered', '显示边框'),
      switchField('loading', '加载中'),
      switchField('pagination', '显示分页'),
    ],
    events: [{ name: 'change', label: '分页/排序变化' }],
    defaultProps: {
      columns: [
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '负责人', dataIndex: 'owner', key: 'owner' },
        { title: '状态', dataIndex: 'status', key: 'status' },
      ],
      dataSource: [
        { id: '1', name: '示例数据一', owner: '张三', status: '进行中' },
        { id: '2', name: '示例数据二', owner: '李四', status: '已完成' },
      ],
      rowKey: 'id',
      bordered: false,
      loading: false,
      pagination: false,
    },
    defaultStyle: { width: '100%' },
    renderer: TableRenderer,
  },
]
