import { defHttp } from '/@/utils/http';

enum Api {
  LOGIN = '/basic-api/sys/login',
  GET_USERINFO = '/basic-api/sys/getUserInfo',
}

export const accountLogin = (data: Recordable) => {
  return defHttp.post({
    url: Api.LOGIN,
    data,
  });
};

export const getUserInfo = (token: string) => {
  return defHttp.get({ url: Api.GET_USERINFO, data: { token } });
};
