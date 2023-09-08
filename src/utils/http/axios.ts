import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { CreateAxiosOptions } from './axiosTransform';
import { RequestOptions, Result } from '/#/axios';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum, RequestMethodEnum } from '/@/enums/httpEnum';
import qs from 'qs';
import { asyncTo } from '../promise';

export interface R<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface RequestParams {
  url: string;
  data?: Record<string, any>;
  config?: AxiosRequestConfig;
  options?: RequestOptions;
}

export default class UAxios {
  private readonly axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  public constructor(options: CreateAxiosOptions) {
    this.axiosInstance = axios.create(options);
    this.options = options;
    this.setupInterceptors();
  }

  private getTransform() {
    return this.options?.transform;
  }

  // 获取axios实例
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // 设置请求头
  setHeader(headers: any) {
    if (!this.axiosInstance) return;
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    // const axiosCanceler = new AxiosCanceler();

    // 注册请求成功Hook
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      // const { ignoreCancelToken } = config.requestOptions;
      return typeof requestInterceptors === 'function'
        ? requestInterceptors(config, this.options)
        : config;
    }, undefined);

    // 注册请求失败Hook
    if (typeof requestInterceptorsCatch === 'function') {
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
    }
    // 注册响应成功Hook
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      return typeof responseInterceptors === 'function' ? responseInterceptors(res) : res;
    }, undefined);

    // 注册响应失败Hook
    if (typeof responseInterceptorsCatch === 'function') {
      this.axiosInstance.interceptors.response.use(undefined, (err) => {
        // @ts-ignore
        responseInterceptorsCatch(this.axiosInstance, err);
      });
    }
  }

  // 处理FormData请求
  supportFormData(options: AxiosRequestConfig) {
    const headers = options.headers || this.options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];
    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(options, 'data') ||
      options.method?.toUpperCase() === RequestMethodEnum.GET
    ) {
      return options;
    }
    return {
      ...options,
      data: qs.stringify(options.data, { arrayFormat: 'brackets' }),
    };
  }

  public request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTransform() || {};
    const { requestOptions } = this.options;
    const mergeOptions = { ...requestOptions, ...options } as RequestOptions;
    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform;
    // 请求前Hook
    if (typeof beforeRequestHook === 'function') {
      conf = beforeRequestHook(conf, mergeOptions);
    }
    conf.requestOptions = requestOptions;
    conf = this.supportFormData(conf);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (typeof transformResponseHook === 'function') {
            try {
              resolve(transformResponseHook(res, mergeOptions));
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          if (typeof requestCatchHook === 'function') {
            reject(requestCatchHook(e, mergeOptions));
            return;
          }
          axios.isAxiosError(e) ? reject(new Error('axios request error!')) : reject(e);
        });
    });
  }

  baseRequest<T = R>(
    { url, data = {}, config = {}, options = {} }: RequestParams,
    method: string = 'GET',
  ) {
    const requestConfig = { url, data, ...config, method };
    return asyncTo<T>(this.request(requestConfig, options));
  }

  get<T = R>(params: RequestParams) {
    return this.baseRequest<T>(params);
  }

  post<T = R>(params: RequestParams) {
    return this.baseRequest<T>(params, 'POST');
  }
}
