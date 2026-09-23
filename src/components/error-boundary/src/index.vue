<script lang="ts">
import dayjs from 'dayjs'
import { useOnline } from '@vueuse/core'
import { Comment, cloneVNode, isVNode } from 'vue'
import { NetworkDisconnectedError, isNetworkDisconnectedError } from '@/errors'
import { ClientError } from '../../exception'
import type { Component } from 'vue'
import type { ComponentPublicInstance, PropType } from 'vue'
import type { ErrorBoundaryErrorPayload, ErrorBoundaryEmits } from './types'

export default defineComponent({
  name: 'ErrorBoundary',
  props: {
    fallback: {
      type: [Object, Function] as PropType<Component>,
      default: undefined,
    },
    showDetails: {
      type: Boolean,
      default: import.meta.env.DEV,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    monitorNetwork: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    error: (_payload: ErrorBoundaryErrorPayload) => true,
    reset: () => true,
  } satisfies {
    [K in keyof ErrorBoundaryEmits]: (...args: ErrorBoundaryEmits[K]) => boolean
  },
  setup(props, { slots, emit, expose }) {
    const hasError = shallowRef(false)
    const errorInfo = shallowRef<ErrorBoundaryErrorPayload | null>(null)

    /**
     * 构建错误负载
     * @param error 错误实例
     * @param info 错误发生阶段
     * @param componentName 发生错误的组件名称
     * @returns 错误负载
     */
    const createPayload = (
      error: Error,
      info: string,
      componentName: string
    ): ErrorBoundaryErrorPayload => ({
      error,
      message: error.message,
      stack: error.stack,
      info,
      componentName,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })

    /**
     * 记录错误状态并对外抛出错误事件
     * @param payload 错误负载
     */
    const applyError = (payload: ErrorBoundaryErrorPayload) => {
      if (hasError.value) return
      hasError.value = true
      errorInfo.value = payload
      emit('error', payload)
    }

    const resetError = () => {
      hasError.value = false
      errorInfo.value = null
      emit('reset')
    }

    /**
     * 监听网络状态:离线时展示网络断开错误,网络恢复后自动重置,
     * 内容区无需再额外包裹网络守卫组件。
     */
    watch(
      useOnline(),
      (isOnline) => {
        if (!props.monitorNetwork) return
        const currentError = errorInfo.value?.error
        const isNetworkError =
          !!currentError && isNetworkDisconnectedError(currentError)
        // 网络恢复后仅自动重置网络错误,不覆盖已捕获的业务异常
        if (isOnline) {
          if (isNetworkError) resetError()
          return
        }
        // 离线时展示网络断开错误,已捕获其他错误时不覆盖
        if (hasError.value && !isNetworkError) return
        applyError(
          createPayload(
            new NetworkDisconnectedError(),
            '网络状态监听',
            'ErrorBoundary'
          )
        )
      },
      { immediate: true }
    )

    onErrorCaptured(
      (
        err: unknown,
        instance: ComponentPublicInstance | null,
        info: string
      ) => {
        // 防止重复捕获或者自身抛出的错误导致无限循环
        if (hasError.value) return false
        applyError(
          createPayload(
            err instanceof Error ? err : new Error(String(err)),
            info,
            instance?.$options?.name || 'AnonymousComponent'
          )
        )
        //  返回 false 会阻止错误继续向上传播
        return !props.stopPropagation
      }
    )
    expose({
      resetError,
      hasError,
    })
    return () => {
      const defaultSlot = slots.default?.()
      const validNodes = (defaultSlot ?? []).filter(
        (vnode) => vnode.type !== Comment
      )
      // 解包单节点数组，防止渲染为 Fragment 从而破坏 Transition/KeepAlive
      const content = validNodes.length === 1 ? validNodes[0] : validNodes

      if (!hasError.value) {
        if (!defaultSlot) return null
        return content
      }

      const fallbackVNode = slots.fallback
        ? h(
            'div',
            { key: 'error-boundary-fallback', class: 'full' },
            slots.fallback(errorInfo.value)
          )
        : props.fallback
          ? h(props.fallback, {
              key: 'error-boundary-fallback',
              error: errorInfo.value,
              onReset: resetError,
            })
          : h(ClientError, {
              key: 'error-boundary-fallback',
              error: errorInfo.value,
              showDetails: props.showDetails,
              onReset: resetError,
            })

      /**
       * 出错时保留默认内容挂载并隐藏（style 会被 diff 移除，可正常恢复），
       * 避免卸载 KeepAlive 中已缓存的页面。
       */
      if (isVNode(content)) {
        return [
          cloneVNode(content, { style: { display: 'none' } }),
          fallbackVNode,
        ]
      }

      return fallbackVNode
    }
  },
})
</script>
