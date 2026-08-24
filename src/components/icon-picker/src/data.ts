import lucideIconSet from '@iconify-json/lucide/icons.json'
import type { IconSelectorOption } from './types'

export const ALL_ICON_CATEGORY = 'all'
export const FREQUENT_ICON_CATEGORY = 'frequent'

export const iconCategoryIconMap: Readonly<Record<string, string>> = {
  [ALL_ICON_CATEGORY]: 'i-lucide:grid-3x3',
  [FREQUENT_ICON_CATEGORY]: 'i-lucide:star',
  business: 'i-lucide:briefcase-business',
  communication: 'i-lucide:messages-square',
  data: 'i-lucide:chart-no-axes-combined',
  development: 'i-lucide:code-xml',
  devices: 'i-lucide:monitor-smartphone',
  files: 'i-lucide:files',
  layout: 'i-lucide:panels-top-left',
  media: 'i-lucide:image-play',
  navigation: 'i-lucide:move-right',
  other: 'i-lucide:ellipsis',
  people: 'i-lucide:users',
  security: 'i-lucide:shield-check',
  shapes: 'i-lucide:shapes',
  text: 'i-lucide:type',
  'time-location': 'i-lucide:map-pin',
  weather: 'i-lucide:cloud-sun',
}

export function getIconCategoryIcon(category: string) {
  return iconCategoryIconMap[category] ?? iconCategoryIconMap.other
}

const lucideIconValues = Object.keys(lucideIconSet.icons)
  .sort((left, right) => left.localeCompare(right))
  .map((name) => `i-lucide:${name}`)

export interface IconCategoryDefinition {
  key: string
  label: string
}

interface IconCategoryRule extends IconCategoryDefinition {
  terms: readonly string[]
}

export const iconCategoryDefinitions: readonly IconCategoryDefinition[] = [
  { key: 'navigation', label: '箭头导航' },
  { key: 'layout', label: '布局界面' },
  { key: 'text', label: '文本编辑' },
  { key: 'media', label: '媒体影音' },
  { key: 'files', label: '文件文档' },
  { key: 'communication', label: '消息沟通' },
  { key: 'people', label: '用户组织' },
  { key: 'data', label: '数据图表' },
  { key: 'business', label: '商业办公' },
  { key: 'development', label: '开发技术' },
  { key: 'devices', label: '设备网络' },
  { key: 'time-location', label: '时间位置' },
  { key: 'security', label: '安全状态' },
  { key: 'weather', label: '天气自然' },
  { key: 'shapes', label: '形状符号' },
  { key: 'other', label: '其他' },
]

const categoryRules: readonly IconCategoryRule[] = [
  {
    key: 'navigation',
    label: '箭头导航',
    terms: [
      'arrow',
      'chevron',
      'corner',
      'move',
      'navigation',
      'redo',
      'refresh',
      'repeat',
      'rotate',
      'route',
      'undo',
    ],
  },
  {
    key: 'layout',
    label: '布局界面',
    terms: [
      'align',
      'columns',
      'dock',
      'expand',
      'fullscreen',
      'gallery',
      'grid',
      'layout',
      'maximize',
      'minimize',
      'panel',
      'rows',
      'sidebar',
      'split',
    ],
  },
  {
    key: 'text',
    label: '文本编辑',
    terms: [
      'a-large-small',
      'baseline',
      'bold',
      'case',
      'heading',
      'indent',
      'italic',
      'letter-text',
      'list',
      'pilcrow',
      'quote',
      'spell-check',
      'strikethrough',
      'text',
      'type',
      'underline',
    ],
  },
  {
    key: 'media',
    label: '媒体影音',
    terms: [
      'album',
      'audio',
      'camera',
      'disc',
      'film',
      'image',
      'mic',
      'music',
      'pause',
      'play',
      'podcast',
      'radio',
      'skip',
      'video',
      'volume',
    ],
  },
  {
    key: 'files',
    label: '文件文档',
    terms: [
      'archive',
      'book',
      'clipboard',
      'file',
      'folder',
      'library',
      'notebook',
      'paperclip',
    ],
  },
  {
    key: 'communication',
    label: '消息沟通',
    terms: [
      'at-sign',
      'bell',
      'inbox',
      'mail',
      'message',
      'phone',
      'rss',
      'send',
    ],
  },
  {
    key: 'people',
    label: '用户组织',
    terms: ['baby', 'contact', 'person', 'user', 'users'],
  },
  {
    key: 'data',
    label: '数据图表',
    terms: [
      'binary',
      'calculator',
      'chart',
      'database',
      'gauge',
      'percent',
      'sigma',
      'table',
    ],
  },
  {
    key: 'business',
    label: '商业办公',
    terms: [
      'badge',
      'banknote',
      'briefcase',
      'building',
      'coins',
      'credit-card',
      'handshake',
      'landmark',
      'package',
      'receipt',
      'shopping',
      'store',
      'truck',
      'wallet',
    ],
  },
  {
    key: 'development',
    label: '开发技术',
    terms: [
      'blocks',
      'bot',
      'braces',
      'bug',
      'code',
      'command',
      'cpu',
      'git',
      'github',
      'server',
      'terminal',
      'webhook',
      'workflow',
    ],
  },
  {
    key: 'devices',
    label: '设备网络',
    terms: [
      'battery',
      'bluetooth',
      'hard-drive',
      'keyboard',
      'laptop',
      'monitor',
      'mouse',
      'printer',
      'signal',
      'smartphone',
      'tablet',
      'usb',
      'watch',
      'wifi',
    ],
  },
  {
    key: 'time-location',
    label: '时间位置',
    terms: [
      'alarm',
      'calendar',
      'clock',
      'compass',
      'globe',
      'hourglass',
      'map',
      'milestone',
      'pin',
      'timer',
    ],
  },
  {
    key: 'security',
    label: '安全状态',
    terms: [
      'alert',
      'ban',
      'eye',
      'fingerprint',
      'key',
      'lock',
      'scan',
      'shield',
    ],
  },
  {
    key: 'weather',
    label: '天气自然',
    terms: [
      'cloud',
      'droplet',
      'flame',
      'flower',
      'leaf',
      'moon',
      'rain',
      'snow',
      'sun',
      'thermometer',
      'tree',
      'umbrella',
      'wind',
    ],
  },
  {
    key: 'shapes',
    label: '形状符号',
    terms: [
      'circle',
      'diamond',
      'hexagon',
      'minus',
      'octagon',
      'plus',
      'shapes',
      'square',
      'triangle',
      'x',
    ],
  },
]

const frequentIconNames = new Set([
  'activity',
  'bell',
  'calendar',
  'chart-no-axes-combined',
  'chart-pie',
  'check',
  'circle-alert',
  'circle-help',
  'circle-user-round',
  'clipboard-list',
  'clock',
  'cloud',
  'copy',
  'database',
  'download',
  'eye',
  'file-text',
  'filter',
  'folder',
  'house',
  'image',
  'layout-dashboard',
  'lock-keyhole',
  'mail',
  'menu',
  'message-circle',
  'monitor',
  'more-horizontal',
  'package',
  'pencil',
  'plus',
  'refresh-cw',
  'search',
  'send',
  'settings',
  'shield-check',
  'sparkles',
  'square-pen',
  'star',
  'trash-2',
  'upload',
  'user',
  'users',
  'x',
])

function getIconName(value: string) {
  return value.replace(/^i-[^:]+:/, '')
}

export function formatIconLabel(value: string) {
  return getIconName(value)
    .split('-')
    .filter(Boolean)
    .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
    .join(' ')
}

export function isFrequentIcon(value: string) {
  return frequentIconNames.has(getIconName(value))
}

function includesTerm(name: string, term: string) {
  return (
    name === term || name.startsWith(`${term}-`) || name.includes(`-${term}`)
  )
}

function resolveIconCategory(value: string) {
  const name = getIconName(value)
  return (
    categoryRules.find((rule) =>
      rule.terms.some((term) => includesTerm(name, term))
    )?.key ?? 'other'
  )
}

export const defaultIconOptions: readonly IconSelectorOption[] =
  lucideIconValues.map((value) => ({
    category: resolveIconCategory(value),
    label: formatIconLabel(value),
    value,
  }))
