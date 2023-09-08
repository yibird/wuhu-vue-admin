import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import {RequestOptions, Result} from "/#/axios";

export interface CreateAxiosOptions extends AxiosRequestConfig {
    authenticationScheme?: string;
    transform?: AxiosTransform;
    requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
    // 请求前hook
    beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
    // 请求失败Hook
    requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;
    // 请求前拦截器
    requestInterceptors?: (config: AxiosRequestConfig, options: CreateAxiosOptions) => AxiosRequestConfig;
    // 请求前错误拦截器处理
    requestInterceptorsCatch?: (error: Error) => void;
    // 响应数据后拦截器
    responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;
    // 响应后错误拦截器处理
    responseInterceptorsCatch?: (axiosInstance: AxiosResponse, error: Error) => void;
    // 处理响应后数据Hook
    transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;
}
