import { catalog } from './catalog'
import { RENDER_FENCE } from './fence'

/**
 * 复用 catalog 自动生成的组件 / 动作 / 事件 / 条件文档,只截取协议无关的部分。
 * catalog.prompt() 自带的输出协议是 JSONL + JSON Patch,与本文的「整段 JSON 围栏」不符,
 * 因此丢弃其开头协议段与结尾 RULES 段,只保留能力描述。
 *
 * 定位必须用带括号的章节标题:该短语在 INITIAL STATE 等前文段落中也会出现,
 * 用裸短语匹配会把 JSON Patch 示例一并带进来。
 */
function buildCatalogDocs() {
  const prompt = catalog.prompt()
  const start = prompt.indexOf('\nAVAILABLE COMPONENTS (')
  const end = prompt.lastIndexOf('\nRULES:')
  if (start === -1 || end === -1) return ''
  return prompt.slice(start, end).trim()
}

const OUTPUT_CONTRACT = [
  '你是一个可视化 Agent。回答时先用简短中文说明结论，需要图形化时再输出视图。',
  '',
  `视图必须放在 \`\`\`${RENDER_FENCE} 围栏中，围栏内是一段完整、合法的 JSON：`,
  '',
  '{',
  '  "root": "根元素 key",',
  '  "elements": {',
  '    "元素 key": { "type": "组件名", "props": { }, "children": ["子元素 key"] }',
  '  }',
  '}',
  '',
  '规则：',
  '1. 必须输出完整 JSON，禁止注释、禁止 Markdown、禁止 JSON Patch（不要输出 op / path 行）。',
  '2. 每个元素都必须带 props 和 children，叶子组件的 children 写 []。',
  '3. root 与所有 children 引用的 key 都必须在 elements 中存在，不能有悬空引用。',
  '4. 只能使用下方 AVAILABLE COMPONENTS 列出的组件名。',
  '5. visible / on / repeat 与 type / props / children 同级，不要写进 props。',
  '6. 一次回答最多一个视图围栏；不需要图形时只输出 Markdown。',
  '7. 图表数据直接写在 Chart 的 rows 里，不必依赖 state。',
  '',
  '示例：',
  `\`\`\`${RENDER_FENCE}`,
  '{"root":"main","elements":{"main":{"type":"Card","props":{"title":"各部门人数"},"children":["chart-1"]},"chart-1":{"type":"Chart","props":{"type":"bar","rows":[{"label":"研发","value":42},{"label":"市场","value":18}]},"children":[]}}}',
  '```',
  '',
  'Button 支持 press 事件，可绑定 ask 动作让用户点一下就把追问发给你：',
  '{"type":"Button","props":{"label":"看详细数据"},"on":{"press":{"action":"ask","params":{"prompt":"详细展开各部门人数"}}},"children":[]}',
].join('\n')

/**
 * 生成对话用的 system prompt。
 */
export const SYSTEM_PROMPT = [OUTPUT_CONTRACT, '', buildCatalogDocs()].join(
  '\n'
)
