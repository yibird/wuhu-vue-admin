import { unref, Ref } from 'vue';
import type { LoadingProps } from './types'
import { createLoading } from './createLoading'

export interface UseLoadingOptions {
    target?: any;
    props?: LoadingProps;
}
type UseLoadingReturn = [() => void, () => void, (tip: string) => void];
export function useLoading(props: LoadingProps): UseLoadingReturn;
export function useLoading(opt: UseLoadingOptions): UseLoadingReturn;
export function useLoading(opt: LoadingProps | UseLoadingOptions): UseLoadingReturn {

    let props: LoadingProps;
    let target: HTMLElement | Ref<HTMLElement> = document.body;
    if (Reflect.has(opt, "target") || Reflect.has(opt, "props")) {
        const options = opt as Partial<UseLoadingOptions>;
        props = options.props || {};
        target = options.target || document.body;
    } else {
        props = opt as LoadingProps;
    }
    // 获取createLoading实例
    const instance = createLoading(props, undefined, true);
    const open = (): void => {
        const t = unref(target as Ref<HTMLElement>);
        if (!t) return;
        instance.open(t);
    }
    const close = (): void => instance.close();
    const setTip = (tip: string) => instance.setTip(tip);
    return [open, close, setTip]
}