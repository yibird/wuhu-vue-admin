<script lang="ts">
import { Comment, defineComponent, h, onErrorCaptured, shallowRef } from 'vue'
import dayjs from 'dayjs'
import { ClientError } from '@/components/exception'
import type { ComponentPublicInstance, PropType } from 'vue'
import type { ErrorBoundaryErrorPayload, ErrorBoundaryEmits } from './types'

export default defineComponent({
  name: 'ErrorBoundary',
  props: {
    fallback: {
      type: [Object, Function] as PropType<import('vue').Component>,
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

    const resetError = () => {
      hasError.value = false
      errorInfo.value = null
      emit('reset')
    }
    onErrorCaptured(
      (
        err: unknown,
        instance: ComponentPublicInstance | null,
        info: string
      ) => {
        // 防止重复捕获或者自身抛出的错误导致无限循环
        if (hasError.value) return false
        const error = err instanceof Error ? err : new Error(String(err))
        const payload: ErrorBoundaryErrorPayload = {
          error,
          message: error.message,
          stack: error.stack,
          info,
          componentName: instance?.$options?.name || 'AnonymousComponent',
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }
        hasError.value = true
        errorInfo.value = payload
        emit('error', payload)
        //  返回 false 会阻止错误继续向上传播
        return !props.stopPropagation
      }
    )
    expose({
      resetError,
      hasError,
    })
    return () => {
      if (!hasError.value) {
        const defaultSlot = slots.default?.()
        if (!defaultSlot) return null
        // 过滤掉注释节点，防止多余节点干扰 Transition
        const validNodes = defaultSlot.filter((vnode) => vnode.type !== Comment)
        // 解包单节点数组，防止渲染为 Fragment 从而破坏 Transition/KeepAlive
        return validNodes.length === 1 ? validNodes[0] : validNodes
      }
      if (slots.fallback) {
        const fallbackVNode = slots.fallback(errorInfo.value)
        return h(
          'div',
          { key: 'error-boundary-fallback', class: 'full' },
          fallbackVNode
        )
      }

      if (props.fallback) {
        return h(props.fallback, {
          key: 'error-boundary-fallback',
          error: errorInfo.value,
          onReset: resetError,
        })
      }

      return h(ClientError, {
        key: 'error-boundary-fallback',
        error: errorInfo.value,
        showDetails: props.showDetails,
        onReset: resetError,
      })
    }
  },
})
</script>
