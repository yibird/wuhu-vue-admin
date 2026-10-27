import { downloadWithProgress } from '@/apis'
import { isCanceledError } from '@/errors'

/**
 * 创建文件下载管理器，支持进度跟踪、取消下载和状态管理。
 *
 * @returns 下载进度、下载状态、错误信息及下载控制方法
 */
export async function useDownload() {
  // 下载进度(0到1区间)
  const progress = ref(0)
  // 下载状态
  const status = ref<'idle' | 'loading' | 'error' | 'done'>('idle')
  // 错误
  const error = ref<unknown>(null)

  let controller: AbortController | null = null

  async function run(url: string, onDone?: (blob: Blob) => void) {
    controller = new AbortController()
    status.value = 'loading'
    progress.value = 0

    try {
      const blob = await downloadWithProgress(
        url,
        ({ percent }) => {
          progress.value = percent
        },
        controller.signal
      )
      onDone?.(blob)
    } catch (e) {
      if (isCanceledError(e)) {
        status.value = 'idle'
        return
      }
      error.value = e
      status.value = 'error'
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
