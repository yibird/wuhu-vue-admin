import type { App, Directive, DirectiveBinding } from 'vue';

export const copy: Directive = {
    beforeMount(el, binding: DirectiveBinding) {
        /**
         * 指令的value是一个数组,数组的第一项为拷贝值,第二项为拷贝成功处理函数,
         * 第三项为拷贝失败处理函数
         */
        if (!Array.isArray(binding.value)) {
            throw new Error('Parameter type error, directive parameter should be an array');
        }
        const [value, successCallback, failCallback] = binding.value;
        if (!value) {
            console.log('无复制内容')
            return
        }
        el.$value = value;
        const handler = () => {
            // 动态创建 textarea 标签
            const textarea = document.createElement('textarea')
            // 将该textarea的readonly设为true,防止IOS下自动唤起键盘,同时将textarea移出可视区域
            textarea.readOnly = true
            textarea.style.position = 'absolute'
            textarea.style.left = '-9999px';
            // 将拷贝的内容赋值给textarea填充
            textarea.value = el.$value;
            // 将 textarea 插入到 body 中
            document.body.appendChild(textarea);
            // 选中值并复制
            textarea.select();
            if (document.execCommand('Copy')) {
                typeof successCallback === 'function' && successCallback();
            } else {
                typeof failCallback === 'function' && failCallback();
            }
            // 移除文本域
            document.body.removeChild(textarea);
        }
        el.clickEvent = handler;
        el.addEventListener('click', handler);
    },
    // 当指令绑定的值发生变化时,重新设置拷贝的值
    updated(el, binding) {
        const [value] = binding.value;
        el.$value = value;
    },
    unmounted(el) {
        el.removeEventListener("click", el.clickEvent);
    }
}

export function setupCopyDirective(app: App) {
    app.directive("copy", copy)
}