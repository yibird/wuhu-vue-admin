import { default as Exception } from './src/Exception.vue'
import notFoundImage from '@/assets/svg/404.svg'
import serverErrorIMage from '@/assets/svg/500.svg'
import notAuthorizedImage from '@/assets/svg/403.svg'

export { default as ClientError } from './src/ClientError.vue'
export type { ExceptionProps } from './src/types'

export const NotFound = h(Exception, {
  title: '抱歉，您访问的页面不存在',
  image: notFoundImage,
})
export const NotAuthorized = h(Exception, {
  title: '抱歉，您没有权限访问该页面',
  image: notAuthorizedImage,
})
export const ServerError = h(Exception, {
  title: '抱歉，服务器发生了错误',
  image: serverErrorIMage,
})

export { Exception }
