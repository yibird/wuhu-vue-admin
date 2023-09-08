import { ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import { createPlugin } from "./build";
import postcss from "./postcss.config.js";

const pathResolve = (dir: string) => resolve(process.cwd(), ".", dir);
const resolveConfig = () => {
  return {
    alias: [
      {
        find: /\/@\//,
        replacement: `${pathResolve("src")}/`,
      },
      {
        find: /\/#\//,
        replacement: `${pathResolve("types")}/`,
      },
    ],
  };
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  return {
    resolve: resolveConfig(),
    plugins: createPlugin(),
    server: {
      host: "0.0.0.0",
      port: 9999
    },
    envDir: "env",
    css: {
      postcss,
    },
  };
};
