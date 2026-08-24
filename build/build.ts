import type { BuildOptions } from 'vite'

interface ChunkGroup {
  /**
   * Chunk 名称。
   */
  name: string

  /**
   * 精确匹配包名。
   */
  packages?: readonly string[]

  /**
   * 匹配包名前缀。
   */
  packagePrefixes?: readonly string[]
}

const chunkGroups: readonly ChunkGroup[] = [
  {
    name: 'vue-vendor',
    packages: [
      'vue',
      'vue-router',
      'pinia',
      'pinia-plugin-persistedstate',
      'vue-i18n',
    ],
    packagePrefixes: ['@vue/', '@intlify/'],
  },

  {
    name: 'antd-vendor',
    packages: ['antdv-next'],
  },

  // ============================================================
  // Heavy feature modules
  // ============================================================

  {
    name: 'editor',
    packagePrefixes: ['@tiptap/', 'prosemirror-'],
  },

  {
    name: 'code-editor',
    packages: ['codemirror'],
    packagePrefixes: ['@codemirror/'],
  },

  {
    name: 'workflow',
    packagePrefixes: ['@vue-flow/'],
  },

  {
    name: 'chart',
    packages: ['echarts', 'vue-echarts'],
  },

  {
    name: 'calendar',
    packages: ['@dayflow/core', '@dayflow/vue', '@dayflow/plugin-drag'],
  },

  {
    name: 'gantt',
    packages: ['frappe-gantt'],
  },

  {
    name: 'cropper',
    packages: ['cropperjs'],
  },

  // jit-viewer follows the document-preview route's dynamic import boundary.
  // Grouping it manually can pull Vite's preload helper into the viewer chunk.
]

const NODE_MODULES = '/node_modules/'

function normalizePath(id: string) {
  return id.replaceAll('\\', '/')
}

/**
 * 判断是否匹配指定 package。
 */
function matchPackage(id: string, packageName: string) {
  return (
    id.includes(`${NODE_MODULES}${packageName}/`) ||
    id.endsWith(`${NODE_MODULES}${packageName}`)
  )
}

/**
 * 判断是否匹配 package 前缀。
 */
function matchPackagePrefix(id: string, prefix: string) {
  return id.includes(`${NODE_MODULES}${prefix}`)
}

function createCodeSplittingGroup(group: ChunkGroup) {
  const { name, packages = [], packagePrefixes = [] } = group
  return {
    name,
    test(id: string) {
      const normalizedId = normalizePath(id)
      // 只处理 node_modules
      if (!normalizedId.includes(NODE_MODULES)) {
        return false
      }
      return (
        packages.some((packageName) =>
          matchPackage(normalizedId, packageName)
        ) ||
        packagePrefixes.some((prefix) =>
          matchPackagePrefix(normalizedId, prefix)
        )
      )
    },
  }
}

/**
 * Vite Build 配置。
 */
export function createBuild(): BuildOptions {
  return {
    target: 'esnext',
    // 生成 manifest
    manifest: true,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // CSS 压缩
    cssMinify: 'lightningcss',
    // JS 压缩
    minify: 'oxc',
    // chunk 过大警告阈值
    chunkSizeWarningLimit: 1000,
    // 报告 chunk 大小,不计算 gzip / brotli 大小,可以明显减少 build 阶段额外开销
    reportCompressedSize: false,
    // Rolldown 配置
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: chunkGroups.map(createCodeSplittingGroup),
        },
      },
    },
  }
}
