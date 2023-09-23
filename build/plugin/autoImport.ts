// 自动导入组件库
import type { Plugin } from 'vite'
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default function createAutoImportPlugin(): Plugin {
  return Components({
    resolvers: [AntDesignVueResolver({
      importStyle: false,
    })],
  });
}
