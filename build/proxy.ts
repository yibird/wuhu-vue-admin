import type { ProxyOptions } from "vite";

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];
type ProxyTargetList = Record<
  string,
  ProxyOptions & { rewrite: (path: string) => string }
>;

export function createProxy(list: ProxyList) {
  const targetList: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = /^https:\/\//.test(prefix);
    targetList[prefix] = {
      target,
      changeOrigin: true,
      ws: false,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return targetList;
}
