import AutoImport from 'unplugin-auto-import/vite'

export function autoImportPlugin() {
  return AutoImport({
    imports: ['vue'],
    dts: 'auto-imports.d.ts'
  })
}
