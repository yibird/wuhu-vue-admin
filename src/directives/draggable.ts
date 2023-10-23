import { App, Directive } from 'vue';

export const draggable: Directive = {
  mounted(el: HTMLElement) {
    el.style.cursor = 'move';
    // 不允许用户选择内容
    el.style.userSelect = 'none';
    el.onmousedown = function (e) {
      // 记录移动前的坐标位置
      const disX = e.pageX - el.offsetLeft,
        disY = e.pageY - el.offsetTop;
      document.onmousemove = function (e) {
        // 获取移动后的坐标
        let x = e.pageX - disX,
          y = e.pageY - disY;
        // 获取最大的移动坐标
        const maxX =
            document.body.clientWidth -
            parseInt(window.getComputedStyle(el).width),
          maxY =
            document.body.clientHeight -
            parseInt(window.getComputedStyle(el).height);
        // 坐标最大最小边界判断
        if (x < 0) {
          x = 0;
        } else if (x > maxX) {
          x = maxX;
        }
        if (y < 0) {
          y = 0;
        } else if (y > maxY) {
          y = maxY;
        }
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
  unmounted(el) {
    el.onmousedown = null;
  },
};
export function setupDraggableDirective(app: App) {
  app.directive('draggable', draggable);
}
