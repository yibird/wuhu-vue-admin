import { lazyImport } from 'vite-plugin-lazy-import'

export function lazyImportPlugin() {
  return lazyImport({
    resolvers: [],
  })
}
