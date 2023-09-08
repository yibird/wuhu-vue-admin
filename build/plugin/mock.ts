import { viteMockServe } from "vite-plugin-mock";

export default function createMockPlugin(isBuild: boolean = false) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: "mock",
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `import { setupProdMockServer } from '../mock/_createProductionServer';
            setupProdMockServer();`,
  });
}
