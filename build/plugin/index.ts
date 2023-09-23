import Vue from '@vitejs/plugin-vue';
import unoCSSPlugin from './unocss'
import createAutoImportPlugin from './autoImport';
// import createMockPlugin from './mock';
import createVueJsx from './vueJsx';
// import createTypeImport from './typeImport';
// import createDynamicImportPlugin from './dynamicImport';

export function createPlugin() {
  return [
    unoCSSPlugin(),
    // createDynamicImportPlugin(),
    createAutoImportPlugin(),
    // createMockPlugin(),
    createVueJsx(),
    Vue({
      reactivityTransform: true,
    }),
    // createTypeImport(),
  ];
}
