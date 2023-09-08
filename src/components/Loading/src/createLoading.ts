import { VNode, defineComponent, createVNode, render, reactive, h } from 'vue';
import Loading from './Loading.vue';
import type { LoadingProps } from './types';

/**
 * 创建Loading 
 * @param props Loading组件的Props 
 * @param target Loading挂载的目标元素
 * @param wait 是否等待
 */
export function createLoading(props: LoadingProps, target?: HTMLElement, wait = false) {
    let vm: Nullable<VNode> = null;
    const data = reactive({
        tip: '',
        loading: true,
        ...props,
    });
    const LoadingWrap = defineComponent({
        render() {
            return h(Loading, { ...data });
        },
    });
    vm = createVNode(LoadingWrap);

    // 通过render()渲染虚拟节点到目标元素
    if (wait) {
        // 处理异步情况
        setTimeout(() => {
            render(vm, document.createElement('div'))
        }, 0)
    } else {
        render(vm, document.createElement('div'));
    }

    // 打开方法,将虚拟节点的真实DOM插入到目标元素
    function open(target: HTMLElement = document.body) {
        if (!vm || !vm.el) {
            return;
        }
        target.appendChild(vm.el as HTMLElement);
    }

    // 关闭方法,获取vm对应的真实DOM节点父节点,并移除对应的真实DOM节点
    function close() {
        if (vm?.el && vm.el.parentNode) {
            vm.el.parentNode.removeChild(vm.el);
        }
    }

    if (target) {
        open(target);
    }
    return {
        vm,
        close,
        open,
        setTip: (tip: string) => {
            data.tip = tip;
        },
        setLoading: (loading: boolean) => {
            data.loading = loading;
        },
        get loading() {
            return data.loading;
        },
        get $el() {
            return vm?.el as HTMLElement;
        },
    }
}