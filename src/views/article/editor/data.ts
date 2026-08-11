import type { EditorDocument } from './types'

export function createInitialDocuments(): EditorDocument[] {
  return [
    {
      id: 'doc-product-roadmap',
      title: '产品发布说明',
      summary: '用于整理版本重点、风险提示和上线检查项。',
      status: 'draft',
      tags: ['产品', '发布'],
      createdAt: '2026-05-26 09:40',
      updatedAt: '2026-06-01 10:18',
      content: `
        <h2>6 月版本发布说明</h2>
        <p>本次版本聚焦「编辑体验」「移动端适配」和「性能边界」三类问题，目标是让后台页面更适合真实业务使用。</p>
        <blockquote><p>发布前请确认核心路径已经完成类型检查、lint 和页面冒烟。</p></blockquote>
        <h3>上线检查</h3>
        <ul>
          <li><p>确认菜单、权限、动态路由均可访问。</p></li>
          <li><p>确认图表、编辑器和复杂页面按需初始化。</p></li>
          <li><p>确认移动端页面没有明显横向溢出。</p></li>
        </ul>
        <table>
          <tbody>
            <tr><th>模块</th><th>负责人</th><th>状态</th></tr>
            <tr><td>编辑器</td><td>平台组</td><td><span style="color: #16a34a">完成</span></td></tr>
            <tr><td>移动端</td><td>体验组</td><td><mark data-color="#fef3c7" style="background-color: #fef3c7">验证中</mark></td></tr>
          </tbody>
        </table>
      `,
    },
    {
      id: 'doc-weekly',
      title: '运营周报模板',
      summary: '沉淀周报结构，方便团队快速复用。',
      status: 'published',
      tags: ['运营', '模板'],
      createdAt: '2026-05-20 14:16',
      updatedAt: '2026-05-30 18:22',
      content: `
        <h2>运营周报</h2>
        <p>本周整体访问量稳定，转化链路仍需继续观察新用户首日行为。</p>
        <h3>关键指标</h3>
        <ol>
          <li><p>新增用户：12,430</p></li>
          <li><p>活跃用户：86,210</p></li>
          <li><p>付费转化率：4.8%</p></li>
        </ol>
        <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>同步本周核心指标</p></div></li>
          <li data-type="taskItem" data-checked="false"><label><input type="checkbox"></label><div><p>补充渠道转化分析</p></div></li>
        </ul>
      `,
    },
    {
      id: 'doc-meeting',
      title: '项目复盘纪要',
      summary: '记录复盘结论和后续负责人。',
      status: 'draft',
      tags: ['项目', '复盘'],
      createdAt: '2026-05-18 16:05',
      updatedAt: '2026-05-29 11:36',
      content: `
        <h2>项目复盘纪要</h2>
        <p>本次迭代在需求拆解阶段暴露出接口依赖识别不充分的问题，后续需要在排期前补齐风险列表。</p>
        <p><span style="font-family: KaiTi, 'Kaiti SC', serif; font-size: 18px; color: #2563eb">关键结论需要沉淀到团队规范。</span></p>
        <pre><code>owner: platform-team
deadline: next sprint</code></pre>
      `,
    },
  ]
}

export const STORAGE_KEYS = {
  documents: 'template-editor-documents',
  activeId: 'template-editor-active-document-id',
  versions: 'template-editor-document-versions',
  comments: 'template-editor-document-comments',
} as const

export const modeOptions = [
  { label: '编辑', value: 'edit', iconName: 'i-lucide:pencil' },
  { label: '预览', value: 'preview', iconName: 'i-lucide:eye' },
  { label: '源码', value: 'source', iconName: 'i-lucide:code-2' },
] as const

export const deviceOptions = [
  { label: '桌面', value: 'desktop', iconName: 'i-lucide:monitor' },
  { label: '平板', value: 'tablet', iconName: 'i-lucide:tablet' },
  { label: '手机', value: 'mobile', iconName: 'i-lucide:smartphone' },
] as const

export const editorFontFamilyOptions = [
  { label: '默认字体', value: '' },
  {
    label: '系统字体',
    value:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif',
  },
  { label: '微软雅黑', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
  { label: '苹方', value: '"PingFang SC", "Microsoft YaHei", sans-serif' },
  { label: '宋体', value: 'SimSun, "Songti SC", serif' },
  { label: '黑体', value: 'SimHei, "Heiti SC", sans-serif' },
  { label: '楷体', value: 'KaiTi, "Kaiti SC", serif' },
  { label: '仿宋', value: 'FangSong, "FangSong SC", serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: '等宽代码', value: '"Cascadia Code", Consolas, monospace' },
]

export const TEMPLATE_MAP = {
  meeting:
    '<h2>会议纪要</h2><p><strong>结论：</strong></p><ul><li><p>待补充</p></li></ul><p><strong>下一步：</strong></p>',
  release:
    '<h2>发布计划</h2><ol><li><p>发布范围</p></li><li><p>风险确认</p></li><li><p>回滚预案</p></li></ol>',
  todo: '<h2>行动清单</h2><ul><li><p>负责人：</p></li><li><p>截止时间：</p></li></ul>',
} as const

export const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'div',
    'span',
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'a',
    'img',
    'strong',
    'em',
    'b',
    'i',
    'u',
    's',
    'strike',
    'del',
    'ins',
    'mark',
    'blockquote',
    'code',
    'pre',
    'sup',
    'sub',
    'abbr',
    'cite',
    'q',
    'figure',
    'figcaption',
    'details',
    'summary',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  ADD_ATTR: ['target'],
}
