import { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestOptions } from '/#/axios';
import UAxios from './axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { clone } from 'lodash-es';
import { deepMerge } from '/@/utils';

const baseURL = import.meta.env.API_BASE_URL;

// 获取用户token
function getToken() {
  return 'token:xxxxx';
}

const transform: AxiosTransform = {
  // 发起请求前Hook
  beforeRequestHook(config: AxiosRequestConfig, options: RequestOptions) {
    return config;
  },
  // 请求拦截器处理函数
  requestInterceptors(config, options) {
    // 获取用户token,每次请求的请求头中都需携带token凭证
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken) {
      (config as Recordable).headers.Authorization =
        options.authenticationScheme
          ? `${options.authenticationScheme} ${token}`
          : token;
    }
    return config;
  },
  // 请求拦截器错误处理函数
  requestInterceptorsCatch(e) {},
  // 响应拦截器处理函数。根据响应状态码进行业务检查
  responseInterceptors(res) {
    return res.data;
  },
  // 响应拦截器错误处理函数。响应错误后将自动重试
  responseInterceptorsCatch(axiosInstance: AxiosResponse, error: any) {
    return Promise.resolve(error);
  },
};

// 默认请求配置
const defaultRequestOptions: CreateAxiosOptions = {
  authenticationScheme: '',
  // 超时时间,默认10s
  timeout: 10 * 1000,
  // 请求基础URL
  baseURL,
  // 请求头,默认请求类型为 ContentTypeEnum.JSON
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 数据处理方式
  transform: clone(transform),
  // 请求配置项
  requestOptions: {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
    // post请求的时候添加参数到url
    joinParamsToUrl: false,
    // 格式化提交参数时间
    formatDate: true,
    // 消息提示类型
    errorMessageMode: 'message',
    // 接口地址
    apiUrl: '',
    // 接口拼接地址
    urlPrefix: '',
    //  是否加入时间戳
    joinTime: true,
    // 忽略重复请求
    ignoreCancelToken: true,
    // 是否携带token
    withToken: true,
    retryRequest: {
      isOpenRetry: true,
      count: 5,
      waitTime: 100,
    },
  },
};

function createAxios(options?: Partial<CreateAxiosOptions>) {
  return new UAxios(deepMerge(defaultRequestOptions, options || {}));
}

export const defHttp = createAxios();
