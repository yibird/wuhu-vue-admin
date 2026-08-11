import Components from 'unplugin-vue-components/vite'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'

export function componentsPlugin(options: { generateDts: boolean }) {
  return Components({
    resolvers: [AntdvNextResolver()],
    dirs: [],
    directoryAsNamespace: false,
    dts: options.generateDts,
    // dirs: ['src/components'],
    // extensions: ['vue', 'ts', 'tsx'],
    // deep: true,
    // dts: 'src/components.d.ts',
    // // globs: ['src/components/*.vue', 'src/components/*/index.vue'],
    // directoryAsNamespace: true,
  })
}
