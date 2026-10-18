import { extname } from 'node:path'
import { pathToFileURL } from 'node:url'

const EXTENSIONS = ['.ts', '.tsx', '/index.ts', '/index.tsx']

/**
 * 为 Node 原生单元测试补充 TypeScript 无扩展名相对导入解析。
 *
 * 源项目使用 bundler 模块解析,相对导入不写扩展名;Node 原生 ESM
 * 要求显式扩展名,这里在默认解析失败时按 TypeScript 规则重试。
 */
export async function resolve(specifier, context, nextResolve) {
  // Windows 绝对路径需要转换为 file:// URL 才能被 ESM 加载器接受
  if (/^[A-Za-z]:[\\/]/.test(specifier)) {
    specifier = pathToFileURL(specifier).href
  }

  try {
    return await nextResolve(specifier, context)
  } catch (error) {
    const isMissingModule = error?.code === 'ERR_MODULE_NOT_FOUND'
    const isRelative = specifier.startsWith('.') || specifier.startsWith('/')
    if (!isMissingModule || !isRelative || extname(specifier)) throw error

    for (const extension of EXTENSIONS) {
      try {
        return await nextResolve(specifier + extension, context)
      } catch {
        // 继续尝试下一个候选扩展名
      }
    }
    throw error
  }
}
