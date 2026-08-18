import type { BuildOptions } from 'vite'

interface ChunkGroup {
  name: string
  packages?: string[]
  packagePrefixes?: string[]
  priority: number
}

const chunkGroups: ChunkGroup[] = [
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
    priority: 100,
  },
  {
    name: 'workflow',
    packagePrefixes: ['@vue-flow/'],
    priority: 50,
  },
  {
    name: 'code-editor',
    packages: ['codemirror'],
    packagePrefixes: ['@codemirror/'],
    priority: 50,
  },
  {
    name: 'calendar',
    packages: ['@dayflow/core', '@dayflow/vue', '@dayflow/plugin-drag'],
    priority: 50,
  },
  {
    name: 'scrollbar',
    packages: ['overlayscrollbars', 'overlayscrollbars-vue'],
    priority: 50,
  },
  {
    name: 'editor',
    packagePrefixes: ['@tiptap/', 'prosemirror-'],
    priority: 50,
  },
]

const routeOnlyPreloadChunkRE =
  /^(?:viewer|chart|workflow|code-editor|calendar|editor|motion|iconPicker|cropper|gantt|jsonView|numberTicker|filePreview)-/

function matchPackage(id: string, pkg: string) {
  return id.includes(`/node_modules/${pkg}/`)
}

function matchPackagePrefix(id: string, prefix: string) {
  return id.includes(`/node_modules/${prefix}`)
}

function createCodeSplittingGroup({
  packages = [],
  packagePrefixes = [],
  ...group
}: ChunkGroup) {
  return {
    ...group,
    test(id: string) {
      const normalized = id.replaceAll('\\', '/')
      if (!normalized.includes('/node_modules/')) return false
      return (
        packages.some((pkg) => matchPackage(normalized, pkg)) ||
        packagePrefixes.some((prefix) => matchPackagePrefix(normalized, prefix))
      )
    },
  }
}

function shouldPreloadDependency(dep: string) {
  return !routeOnlyPreloadChunkRE.test(dep.split('/').pop() ?? dep)
}

export function createBuild(): BuildOptions {
  return {
    target: 'esnext',
    manifest: true,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    modulePreload: {
      resolveDependencies(_url, deps, { hostType }) {
        // Route chunks are listed in the glob-generated router module. Avoid
        // downloading page-only packages from index.html, but keep navigation
        // preloads parallel once a route is actually requested.
        return hostType === 'html' ? deps.filter(shouldPreloadDependency) : deps
      },
    },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: chunkGroups.map(createCodeSplittingGroup),
        },
      },
    },
  }
}
