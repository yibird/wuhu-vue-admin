import { existsSync, readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import type { PluginOption } from 'vite'

interface PerformanceGuardOptions {
  strict?: boolean
}

interface ViolationRule {
  code: string
  message: string
  pattern: RegExp
}

const SOURCE_FILE_RE = /\.(?:vue|ts|tsx|js|jsx|css|less|scss|sass)$/
const NODE_MODULES_RE = /[/\\]node_modules[/\\]/

const RULES: ViolationRule[] = [
  {
    code: 'transition-all',
    message:
      'Avoid transition-all. Use transition-colors, transition-opacity, transition-transform, or transition-[...] instead.',
    pattern: /\btransition-all\b/,
  },
  {
    code: 'transition-all-css',
    message:
      'Avoid transition: all. Animating every property can trigger unnecessary layout and paint work.',
    pattern: /transition\s*:\s*all\b/,
  },
  {
    code: 'aieditor-import',
    message:
      'AiEditor has been replaced by Tiptap. Remove stale AiEditor imports and chunk rules.',
    pattern:
      /(?:from\s+['"]aieditor(?:\/[^'"]*)?['"]|import\(['"]aieditor(?:\/[^'"]*)?['"]\))/,
  },
]

const CONFIG_RULES: ViolationRule[] = [
  {
    code: 'aieditor-chunk',
    message:
      'AiEditor has been replaced by Tiptap. Keep manual chunk rules aligned with the current editor stack.',
    pattern: /packages\s*:\s*\[[^\]]*['"]aieditor['"]/s,
  },
]

function normalizePath(path: string) {
  return path.replaceAll('\\', '/')
}

function stripQuery(id: string) {
  return id.split('?', 1)[0]
}

function shouldCheckFile(id: string) {
  const filePath = stripQuery(id)
  return SOURCE_FILE_RE.test(filePath) && !NODE_MODULES_RE.test(filePath)
}

function createViolationMessage(root: string, id: string, rule: ViolationRule) {
  const filePath = normalizePath(relative(root, stripQuery(id)))
  return `[PerformanceGuard:${rule.code}] ${filePath}\n${rule.message}`
}

function checkCode(code: string, rules: ViolationRule[]) {
  return rules.filter((rule) => rule.pattern.test(code))
}

export function performanceGuardPlugin({
  strict = false,
}: PerformanceGuardOptions = {}): PluginOption {
  let root = process.cwd()

  return {
    name: 'performance-guard',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      const viteConfigPath = resolve(root, 'vite.config.ts')
      if (!existsSync(viteConfigPath)) return

      const violations = checkCode(
        readFileSync(viteConfigPath, 'utf8'),
        CONFIG_RULES
      )
      if (!violations.length) return

      const message = violations
        .map((rule) => createViolationMessage(root, viteConfigPath, rule))
        .join('\n\n')

      if (strict) {
        this.error(message)
        return
      }

      this.warn(message)
    },
    transform(code, id) {
      if (!shouldCheckFile(id)) return

      const violations = checkCode(code, RULES)
      if (!violations.length) return

      const message = violations
        .map((rule) => createViolationMessage(root, id, rule))
        .join('\n\n')

      if (strict) {
        this.error(message)
        return
      }

      this.warn(message)
    },
  }
}
