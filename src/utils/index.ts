import { isObject } from "./is";

/**
 * 深度合并对象
 * @param src 源对象
 * @param target 合并目标对象
 */
export function deepMerge<T extends Record<string, any>>(src: T, target: T) {
  for (let key in target) {
    src[key] = isObject(src[key])
      ? deepMerge(src[key], target[key])
      : (src[key] = target[key]);
  }
  return src;
}
