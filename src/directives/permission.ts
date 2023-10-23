import { App, Directive, DirectiveBinding } from 'vue';
import { intersection } from 'lodash-es';

// 权限列表
const permissions = ['add', 'delete', 'update', 'query', 'import', 'export'];

function checkPermission(value: string | string[], permissions: string[]) {
  if (Array.isArray(value)) {
    // 获取两个数组的交集
    return intersection(permissions, value).length > 0;
  }
  return permissions.includes(value);
}

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const permission = binding.value || '';
    if (typeof permission !== 'string' && !Array.isArray(permission)) {
      throw new Error(
        'parameter error,The parameter must be a string or an array of strings',
      );
    }
    const hasPermission = checkPermission(permission, permissions);
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  },
};
export function setupPermissionDirective(app: App) {
  app.directive('permission', permission);
}
