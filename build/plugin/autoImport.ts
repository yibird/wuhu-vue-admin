// 自动导入组件库
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default function createAutoImportPlugin() {
  return Components({
    resolvers: [AntDesignVueResolver()],
  });
}
