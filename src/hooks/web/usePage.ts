import { unref } from 'vue';
import type { Router, RouteLocationRaw } from 'vue-router';
import { useRouter } from 'vue-router';
import { PageEnum } from '/@/enums/pageEnum';
import { REDIRECT_NAME } from '/@/router/constant';
import { isString } from '/@/utils/is';

export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & {
  path: PageEnum;
};

type Option = RouteLocationRawEx | PageEnum;

function handleError(e: Error) {
  console.error(e);
}

/**
 * 路由跳转Hook,返回一个go函数用于跳转指定path
 * @param _router Router实例
 */
export function useGo(_router?: Router) {
  const { push, replace } = _router || useRouter();
  const go = (opt: Option | string = PageEnum.BASE_HOME, isReplace: boolean = false) => {
    if (!opt) return;
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
      return;
    }
    const raw = opt as RouteLocationRaw;
    isReplace ? replace(raw).catch(handleError) : push(raw).catch(handleError);
  };
  return go;
}

/**
 * useRedo返回一个redo函数用于重定向当前页面
 * @param _router
 */
export function useRedo(_router?: Router) {
  const { replace, currentRoute } = _router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);
  const redo = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (name === REDIRECT_NAME) {
        resolve(false);
        return;
      }
      if (name && Object.keys(params).length > 0) {
        Object.assign(params, {
          _redirect_type: 'name',
          path: String(name),
        });
      } else {
        Object.assign(params, {
          _redirect_type: 'path',
          path: fullPath,
        });
      }
      replace({ path: fullPath, params, query }).then(() => resolve(true));
    });
  };
  return redo;
}
