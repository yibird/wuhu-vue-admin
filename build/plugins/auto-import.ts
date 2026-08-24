import AutoImport from 'unplugin-auto-import/vite'

export function autoImportPlugin({ isDev }: { isDev: boolean }) {
  return AutoImport({
    imports: ['vue'],
    dts: isDev ? 'auto-imports.d.ts' : false,
  })
}
