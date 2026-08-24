import Components from 'unplugin-vue-components/vite'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'

export function componentsPlugin({ isDev }: { isDev: boolean }) {
  return Components({
    resolvers: [AntdvNextResolver()],
    dirs: [],
  })
}
