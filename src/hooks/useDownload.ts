import { downloadWithProgress } from '@/apis'
import { isCanceledError } from '@/errors'

/**
 * 创建文件下载管理器，支持进度跟踪、取消下载和状态管理。
 *
 * @returns 下载进度、下载状态、错误信息及下载控制方法
 */
export function useDownload() {
  const progress = ref(0)
  const status = ref<'idle' | 'loading' | 'error' | 'done'>('idle')
  const error = ref<unknown>(null)

  let controller: AbortController | null = null

  async function run(url: string, onDone?: (blob: Blob) => void) {
    controller = new AbortController()
    status.value = 'loading'
    progress.value = 0
    error.value = null

    try {
      const blob = await downloadWithProgress(
        url,
        ({ percent }) => {
          progress.value = percent
        },
        controller.signal
      )
      onDone?.(blob)
      status.value = 'done'
    } catch (e) {
      if (isCanceledError(e)) {
        status.value = 'idle'
        return
      }
      error.value = e
      status.value = 'error'
    } finally {
      controller = null
    }
  }

  function cancel() {
    controller?.abort()
  }

  return {
    progress,
    status,
    error,
    run,
    cancel,
  }
}
