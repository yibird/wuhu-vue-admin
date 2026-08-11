interface ChunkGroup {
  name: string
  packages?: string[]
  packagePrefixes?: string[]
}

const chunkGroups: ChunkGroup[] = [
  { name: 'vue-vendor', packages: ['vue', 'vue-router', 'pinia', 'vue-i18n'] },
  {
    name: 'antdv',
    packages: ['antdv-next'],
  },
  { name: 'chart', packages: ['echarts', 'vue-echarts'] },
  { name: 'viewer', packages: ['jit-viewer'] },
  { name: 'workflow', packagePrefixes: ['@vue-flow/'] },
  {
    name: 'code-editor',
    packages: ['codemirror'],
    packagePrefixes: ['@codemirror/'],
  },
  {
    name: 'calendar',
    packages: ['@dayflow/core', '@dayflow/vue', '@dayflow/plugin-drag'],
  },
  { name: 'motion', packages: ['motion-v'] },
  {
    name: 'scrollbar',
    packages: ['overlayscrollbars', 'overlayscrollbars-vue'],
  },
  { name: 'editor', packagePrefixes: ['@tiptap/', 'prosemirror-'] },
]

const routeOnlyPreloadChunkRE =
  /^(?:viewer|chart|workflow|code-editor|calendar|editor|motion)-/
const vitePreloadHelperRE = /\0vite\/preload-helper(?:\.js)?$/

function matchPackage(id: string, pkg: string) {
  return id.includes(`/node_modules/${pkg}/`)
}

function matchPackagePrefix(id: string, prefix: string) {
  return id.includes(`/node_modules/${prefix}`)
}

function manualChunks(id: string) {
  const normalized = id.replaceAll('\\', '/')
  if (vitePreloadHelperRE.test(normalized)) return 'preload-helper'
  if (!normalized.includes('node_modules')) return
  return chunkGroups.find(
    ({ packages = [], packagePrefixes = [] }) =>
      packages.some((pkg) => matchPackage(normalized, pkg)) ||
      packagePrefixes.some((prefix) => matchPackagePrefix(normalized, prefix))
  )?.name
}

function shouldPreloadDependency(dep: string) {
  return !routeOnlyPreloadChunkRE.test(dep.split('/').pop() ?? dep)
}

export function createBuild() {
  return {
    target: 'esnext',
    manifest: true,
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      resolveDependencies(_url: string, deps: string[]) {
        return deps.filter(shouldPreloadDependency)
      },
    },
    rolldownOptions: {
      output: { manualChunks },
    },
  }
}
