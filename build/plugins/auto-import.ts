import AutoImport from 'unplugin-auto-import/vite'

interface AutoImportPluginOptions {
  generateDts: boolean
}

export function autoImportPlugin({ generateDts }: AutoImportPluginOptions) {
  return AutoImport({
    imports: ['vue'],
    dts: generateDts ? 'auto-imports.d.ts' : false,
  })
}
