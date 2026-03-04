import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export function componentsPlugin() {
  return Components({
    resolvers: [NaiveUiResolver()],
    dirs: ['src/components'],
    extensions: ['vue', 'ts', 'tsx'],
    deep: true,
    dts: 'src/components.d.ts',
    // globs: ['src/components/*.vue', 'src/components/*/index.vue'],
    directoryAsNamespace: true,
  })
}
