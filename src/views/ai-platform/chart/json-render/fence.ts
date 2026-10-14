/**
 * 视图围栏的语言标识。
 * 单独成文件是为了让消息解析器不必依赖 catalog(zod),
 * 从而把生成式 UI 的依赖留在异步 chunk 内。
 */
export const RENDER_FENCE = 'json-render'
