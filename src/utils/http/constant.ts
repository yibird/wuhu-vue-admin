/**
 * 无需携带 token 的接口白名单
 *
 * 路径需写成「去掉 API 基础路径后」的形式:isWhiteListed 会先剥离
 * VITE_API_BASE_URL(如 /api),例如 /api/auth/login 在这里应写 /auth/login。
 */
export const AUTH_WHITE_LIST: string[] = ['/auth/login', '/ai']
