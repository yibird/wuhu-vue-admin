import type { MenuProps } from 'antdv-next'
import type {
  EditorColorOption,
  EditorLocale,
  EditorSelectOption,
} from './types'

export const editorHeadingLevels = [1, 2, 3, 4, 5, 6] as const

export const blockOptions = [
  { label: '正文', value: 'paragraph' },
  { label: '标题 1', value: '1' },
  { label: '标题 2', value: '2' },
  { label: '标题 3', value: '3' },
  { label: '标题 4', value: '4' },
  { label: '标题 5', value: '5' },
  { label: '标题 6', value: '6' },
] satisfies readonly EditorSelectOption[]

export const defaultFontFamilyOptions = [
  { label: '默认字体', value: '' },
  {
    label: '系统无衬线',
    value:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif',
  },
  { label: '微软雅黑', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
  { label: '苹方', value: '"PingFang SC", "Microsoft YaHei", sans-serif' },
  { label: '宋体', value: 'SimSun, "Songti SC", serif' },
  { label: '黑体', value: 'SimHei, "Heiti SC", sans-serif' },
  { label: '楷体', value: 'KaiTi, "Kaiti SC", serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times', value: '"Times New Roman", Times, serif' },
  { label: '等宽代码', value: '"Cascadia Code", Consolas, monospace' },
] satisfies readonly EditorSelectOption[]

export const fontSizeOptions = [
  { label: '默认字号', value: '' },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '40px', value: '40px' },
  { label: '48px', value: '48px' },
] satisfies readonly EditorSelectOption[]

export const textColorOptions = [
  { label: '默认颜色', value: '', color: 'transparent' },
  { label: '正文黑', value: '#111827', color: '#111827' },
  { label: '灰色', value: '#64748b', color: '#64748b' },
  { label: '主题色', value: '#2563eb', color: '#2563eb' },
  { label: '绿色', value: '#16a34a', color: '#16a34a' },
  { label: '橙色', value: '#ea580c', color: '#ea580c' },
  { label: '红色', value: '#dc2626', color: '#dc2626' },
  { label: '紫色', value: '#7c3aed', color: '#7c3aed' },
] satisfies readonly EditorColorOption[]

export const highlightColorOptions = [
  { label: '无高亮', value: '', color: 'transparent' },
  { label: '浅黄', value: '#fef3c7', color: '#fef3c7' },
  { label: '浅蓝', value: '#dbeafe', color: '#dbeafe' },
  { label: '浅绿', value: '#dcfce7', color: '#dcfce7' },
  { label: '浅红', value: '#fee2e2', color: '#fee2e2' },
  { label: '浅紫', value: '#ede9fe', color: '#ede9fe' },
] satisfies readonly EditorColorOption[]

export const tableMenuItems = [
  { key: 'insertTable', label: '插入 3 x 3 表格' },
  { type: 'divider' },
  { key: 'addColumnBefore', label: '左侧插入列' },
  { key: 'addColumnAfter', label: '右侧插入列' },
  { key: 'deleteColumn', label: '删除当前列' },
  { type: 'divider' },
  { key: 'addRowBefore', label: '上方插入行' },
  { key: 'addRowAfter', label: '下方插入行' },
  { key: 'deleteRow', label: '删除当前行' },
  { type: 'divider' },
  { key: 'toggleHeaderRow', label: '切换表头行' },
  { key: 'toggleHeaderColumn', label: '切换表头列' },
  { key: 'mergeOrSplit', label: '合并或拆分单元格' },
  { type: 'divider' },
  { key: 'deleteTable', label: '删除表格', danger: true },
] satisfies NonNullable<MenuProps['items']>

export const imageMenuItems = [
  { key: 'url', label: '图片链接' },
  { key: 'upload', label: '本地图片' },
] satisfies NonNullable<MenuProps['items']>

export const defaultEditorLocale: EditorLocale = {
  addColumnAfter: '右侧插入列',
  addColumnBefore: '左侧插入列',
  addRowAfter: '下方插入行',
  addRowBefore: '上方插入行',
  alignCenter: '居中',
  alignJustify: '两端对齐',
  alignLeft: '左对齐',
  alignRight: '右对齐',
  blockquote: '引用',
  bold: '加粗',
  bulletList: '无序列表',
  characterUnit: '字符',
  clearFormatting: '清除格式',
  code: '行内代码',
  codeBlock: '代码块',
  deleteColumn: '删除当前列',
  deleteRow: '删除当前行',
  deleteTable: '删除表格',
  editorName: 'Tiptap Rich Editor',
  horizontalRule: '分割线',
  image: '图片',
  imageEmpty: '图片上传结果为空',
  imageInvalid: '请选择图片文件',
  imagePrompt: '请输入图片地址',
  imageReadFailed: '图片读取失败',
  imageTooLarge: (limitMb) => `图片不能超过 ${limitMb} MB`,
  insertTable: '插入 3 x 3 表格',
  italic: '斜体',
  link: '链接',
  linkPrompt: '请输入链接地址',
  localImage: '本地图片',
  mergeOrSplit: '合并或拆分单元格',
  orderedList: '有序列表',
  redo: '重做',
  strike: '删除线',
  subscript: '下标',
  superscript: '上标',
  table: '表格',
  taskList: '任务列表',
  toggleHeaderColumn: '切换表头列',
  toggleHeaderRow: '切换表头行',
  underline: '下划线',
  undo: '撤销',
  urlImage: '图片链接',
  wordUnit: '词',
}
