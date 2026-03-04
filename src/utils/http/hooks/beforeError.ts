import type { BeforeErrorHook } from 'ky';

export const beforeErrorHook: BeforeErrorHook = (error) => {
	const { response } = error;
	if (response) {
		console.error('HTTP Error:', response.status);
	} else {
		console.error('Network Error:', error.message);
	}
	return error;
};

export const beforeError: BeforeErrorHook[] = [beforeErrorHook];
