import createDOMPurify from 'dompurify'

/**
 * 允许保留的标签
 *
 * 与编辑器 schema 实际产出的标签一一对应:
 * 少了 input / label 会丢掉任务列表的复选框,少了 div 会丢掉列表项内的正文包裹层。
 */
const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'div',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'label',
  'input',
  'blockquote',
  'pre',
  'code',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'del',
  'sub',
  'sup',
  'mark',
  'a',
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

/**
 * 允许保留的属性
 *
 * data-type / data-checked 承载任务列表语义,colwidth / colspan / rowspan 承载表格语义,
 * 都是 TipTap 自己的输出,不能丢。
 */
const ALLOWED_ATTR = [
  'href',
  'target',
  'rel',
  'src',
  'alt',
  'title',
  'loading',
  'class',
  'style',
  'type',
  'checked',
  'disabled',
  'colspan',
  'rowspan',
  'colwidth',
  'data-type',
  'data-checked',
]

/**
 * 允许保留的 CSS 属性
 *
 * 编辑器的字号 / 字色 / 高亮 / 对齐都以行内 style 存储,必须保留;
 * 但只放行这些,避免 position / z-index 之类的定位样式被注入后做成浮层覆盖。
 */
const ALLOWED_STYLE_PROPERTIES = new Set([
  'color',
  'background-color',
  'font-size',
  'font-family',
  'font-weight',
  'font-style',
  'text-align',
  'text-decoration',
])

const purifier = createDOMPurify()

purifier.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName !== 'style') return
  data.attrValue = filterStyleProperties(data.attrValue)
})

function filterStyleProperties(style: string) {
  return style
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .filter((declaration) => {
      const property = declaration.split(':')[0]?.trim().toLowerCase()
      return property ? ALLOWED_STYLE_PROPERTIES.has(property) : false
    })
    .join('; ')
}

/**
 * 清洗外部 HTML
 *
 * 编辑器自身的 setHTML / v-model 回填 / insertHTML 都可能拿到外部字符串。
 * ProseMirror 的解析器会丢弃 schema 之外的标签与属性、Link 也会拦掉非法协议,
 * 这里再兜一层:去掉脚本类标签,并把行内 style 收窄到白名单属性。
 *
 * @param html 待清洗的 HTML
 * @returns 清洗后的 HTML
 */
export function sanitizeEditorHtml(html: string) {
  if (typeof html !== 'string' || !html) return ''
  return purifier.sanitize(html, {
    ALLOWED_ATTR,
    ALLOWED_TAGS,
    ALLOW_DATA_ATTR: true,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })
}
