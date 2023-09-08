import Vue from '@vitejs/plugin-vue';
import VueMacros from 'unplugin-vue-macros/vite';
import createDynamicImportPlugin from './dynamicImport';
import createAutoImportPlugin from './autoImport';
import createMockPlugin from './mock';
import createVueJsx from './vueJsx';
import createTypeImport from './typeImport';

export function createPlugin() {
  return [
    // createDynamicImportPlugin(),
    createAutoImportPlugin(),
    createMockPlugin(),
    createVueJsx(),
    // VueMacros({
    //   plugins: {
    //     vue: Vue({
    //       reactivityTransform: true,
    //     }),
    //   },
    // }),
    Vue({
      reactivityTransform: true,
    }),
    // createTypeImport(),
  ];
}
