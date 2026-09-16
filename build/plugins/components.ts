import Components from 'unplugin-vue-components/vite'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'

export function componentsPlugin() {
  return Components({
    resolvers: [AntdvNextResolver()],
    dirs: [],
  })
}
