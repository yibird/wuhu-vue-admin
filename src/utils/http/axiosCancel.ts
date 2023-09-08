import type {AxiosRequestConfig, Canceler} from 'axios';
import axios from 'axios';

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

// 取消token容器,以请求url为key,取消token为value
let pendingMap = new Map<string, Canceler>();

// 创建取消token
const createCancelToken = (url: string) => {
    return new axios.CancelToken((cancel) => {
        !pendingMap.has(url) && pendingMap.set(url, cancel);
    });
}

export default class AxiosCancel {
    addPending(config: AxiosRequestConfig) {
        this.removePending(config);
        const url = getPendingUrl(config);
        config.cancelToken = config.cancelToken || createCancelToken(url);
    }

    removePending(config: AxiosRequestConfig) {
        const url = getPendingUrl(config);
        if (!pendingMap.has(url)) return;
        const cancel = pendingMap.get(url);
        cancel && cancel(url);
        pendingMap.delete(url);
    }

    removeAllPending() {
        pendingMap.forEach((cancel) => {
            cancel && typeof cancel === "function" && cancel();
        });
        pendingMap.clear();
    }

    reset(): void {
        pendingMap = new Map<string, Canceler>();
    }
}