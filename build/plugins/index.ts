import { vueDevToolsPlugin } from './devTools';
import { unocssPlugin } from './unocss';
import { componentsPlugin } from './components';
import { jsxPlugin } from './jsx';
import { vuePlugin } from './vue';
import { autoImportPlugin } from './autoImport';
import { mockPlugin } from './mock';
import { inspectPlugin } from './inspect';

export function createPlugin() {
  return [
    vueDevToolsPlugin(),
    componentsPlugin(),
    unocssPlugin(),
    autoImportPlugin(),
    jsxPlugin(),
    vuePlugin(),
    mockPlugin(),
    inspectPlugin(),
  ];
}
