import { getCurrentInstance, reactive, shallowRef, watchEffect } from "vue";

interface Params {
  // 是否排除时间侦听器
  excludeListeners?: boolean;
  // 排除属性集合
  excludeKeys?: string[];
  // 是否排除默认属性(class、style)
  excludeDefaultKeys?: false;
}
const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
const LISTENER_PREFIX = /^on[A-Z]/;

export function entries<T>(obj: Recordable<T>): [string, T][] {
  return Object.keys(obj).map((key: string) => [key, obj[key]]);
}

export function useAttrs(params: Params = {}) {
  // 获取当前组件实例
  const instance = getCurrentInstance();
  if (!instance) return {};
  const {
    excludeListeners = false,
    excludeKeys = [],
    excludeDefaultKeys = true,
  } = params;
  const allExcludeKeys = excludeKeys.concat(
    excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []
  );
  const attrs = shallowRef({});
  instance.attrs = reactive(instance.attrs);

  watchEffect(() => {
    // 获取attrs
    attrs.value = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (
        !allExcludeKeys.includes(key) &&
        !(excludeListeners && LISTENER_PREFIX.test(key))
      ) {
        acm[key] = val;
      }
      return acm;
    }, {} as Recordable);
  });
  return attrs;
}
