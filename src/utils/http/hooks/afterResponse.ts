import type { AfterResponseHook } from 'ky';

const dataResponseHook: AfterResponseHook = (_req, _options, res) => {
	// if (!res.ok && res.status === 401) {
	// 	// 可跳转登录页
	// }
	return res.json();
};

export const afterResponse: AfterResponseHook[] = [dataResponseHook];
