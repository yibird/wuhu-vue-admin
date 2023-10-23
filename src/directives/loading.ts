import { App, Directive, DirectiveBinding } from 'vue';
import { createLoading } from '/@/components/Loading';

export const loading: Directive = {
  mounted(el, binding: DirectiveBinding) {
    // 从挂载元素的自定义属性上获取createLoading()所需参数
    const tip = el.getAttribute('loading-tip'),
      background = el.getAttribute('loading-background'),
      size = el.getAttribute('loading-size');
    const fullscreen = !!binding.modifiers.fullscreen;
    const instance = createLoading(
      {
        tip,
        background,
        size: size || 'default',
        loading: !!binding.value,
        fullscreen,
      },
      fullscreen ? document.body : el,
    );
    // 容器loading设置挂载元素为相对布局,这可能会影响挂载元素
    if (!fullscreen) {
      el.style.position = 'relative';
    }
    el.instance = instance;
  },
  updated(el, binding) {
    const instance = el.instance;
    if (!instance) return;
    instance.setTip(el.getAttribute('loading-tip'));
    // 如果指定绑定的值更新前和更新后不一致,则重新设置loading状态
    if (binding.oldValue !== binding.value) {
      instance.setLoading?.(binding.value && !instance.loading);
    }
  },
  unmounted(el) {
    el?.instance?.close();
  },
};

export function setupLoadingDirective(app: App) {
  app.directive('loading', loading);
}
