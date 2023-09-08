import {AxiosError, AxiosInstance} from "axios";

export default class AxiosRetry {
    retry(AxiosInstance: AxiosInstance, error: AxiosError) {
        // @ts-ignore
        const {config} = error.response;
        // 获取重试间隔时间和重试次数
        const {waitTime, count} = config?.requestOptions?.retryRequest;
        config.__retryCount = config.__retryCount || 0;
        // 如果实际重试次数大于重试次数则停止重试,直接返回一个rejected状态的Promise
        if (config.__retryCount >= count) {
            return Promise.reject(error);
        }
        config.__retryCount += 1;
        return this.delay(waitTime).then(() => AxiosInstance(config));
    }

    delay(waitTime: number) {
        return new Promise((resolve) => setTimeout(resolve, waitTime));
    }
}