import type { Directive } from 'vue'

/** 输入框内的附加控件:清除按钮、密码可见性切换 */
const SUFFIX_CONTROL_SELECTOR =
  '.ant-input-clear-icon, .ant-input-password-icon'

/**
 * 让输入框内的附加控件不参与 Tab 序列
 *
 * antd 的清除按钮、密码可见性切换都是可聚焦元素,会截断「字段 → 字段」的 Tab 顺序
 * (例如「密码 → 眼睛图标 → 确认密码」)。它们仍可用鼠标操作,
 * 键盘用户清空可用全选 + 删除,因此只调整 Tab 顺序,不影响点击行为。
 *
 * 用法:`<a-input v-input-tab-out allow-clear />`、`<a-input-password v-input-tab-out />`
 */
export const inputTabOut: Directive<HTMLElement> = {
  mounted(el) {
    el.querySelectorAll<HTMLElement>(SUFFIX_CONTROL_SELECTOR).forEach(
      (node) => {
        node.setAttribute('tabindex', '-1')
      }
    )
  },
}
