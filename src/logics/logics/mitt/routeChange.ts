import mitt from '/@/utils/mitt';
import type { RouteLocationNormalized } from 'vue-router';
const key = Symbol();

const emitter = mitt();
let lastChangeTab: RouteLocationNormalized;

export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  //   const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, lastChangeRoute);
  lastChangeTab = lastChangeRoute;
}

/**
 * 监听路由变化时触发
 * @param callback 事件处理器
 * @param immediate 是否立即触发
 */
export function listenerRouteChange(
  callback: (route?: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  emitter.clear();
}
