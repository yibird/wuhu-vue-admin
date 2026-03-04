import type { BeforeRetryHook } from 'ky';

// 配置最大重试次数
const MAX_RETRY_COUNT = 3;

// 指数退避函数(可选) 300ms, 600ms, 1200ms
function getRetryDelay(retryCount: number) {
	return 300 * 2 ** (retryCount - 1); // 300ms, 600ms, 1200ms
}

// 单个 beforeRetryHook
const retryHook: BeforeRetryHook = ({ request, error, retryCount }) => {
	console.log(`[ky retry] url=${request.url}, retryCount=${retryCount}`, error);

	if (retryCount >= MAX_RETRY_COUNT) {
		console.warn(`[ky retry] reached max retry for ${request.url}`);
		return;
	}

	// // 可选：根据 HTTP 状态码决定是否重试
	// if (response && [500, 502, 503, 504].includes(error.response.status)) {
	// 	const delay = getRetryDelay(retryCount);
	// 	console.log(`[ky retry] will retry after ${delay}ms`);
	// 	return new Promise((resolve) => setTimeout(resolve, delay));
	// }

	// // 如果没有 HTTP 响应（网络错误等）也可以重试
	// if (!error?.response) {
	// 	const delay = getRetryDelay(retryCount);
	// 	return new Promise((resolve) => setTimeout(resolve, delay));
	// }
};

export const beforeRetry: BeforeRetryHook[] = [retryHook];
