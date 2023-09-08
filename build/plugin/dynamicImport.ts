import dynamicImport from "vite-plugin-dynamic-import";

export default function createDynamicImportPlugin() {
  return (dynamicImport as any).default({ loose: true });
}
