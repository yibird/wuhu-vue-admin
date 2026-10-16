import { defineComponent, h } from 'vue'
import { default as Exception } from './src/exception.vue'
import notFoundImage from '@/assets/svg/404.svg'
import serverErrorImage from '@/assets/svg/500.svg'
import notAuthorizedImage from '@/assets/svg/403.svg'
import type { ExceptionProps } from './src/types'

export { default as ClientError } from './src/client-error.vue'
export type { ExceptionProps } from './src/types'

/**
 * 生成带固定文案与插图的异常页组件
 *
 * 这里返回组件定义而不是模块顶层 `h()` 出来的 VNode：VNode 是共享单例且没有组件语义，
 * 既无法可靠接收 props/attrs/插槽，也不能作为路由的 component 使用。
 *
 * @param props 预置的异常页属性，调用方传入的同名属性会覆盖它
 * @returns 可直接用于模板与路由的组件定义
 */
function createException(props: ExceptionProps) {
  return defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(Exception, { ...props, ...attrs }, slots)
    },
  })
}

export const NotFound = createException({
  title: '抱歉，您访问的页面不存在',
  image: notFoundImage,
})

export const NotAuthorized = createException({
  title: '抱歉，您没有权限访问该页面',
  image: notAuthorizedImage,
})

export const ServerError = createException({
  title: '抱歉，服务器发生了错误',
  image: serverErrorImage,
})

export { Exception }
