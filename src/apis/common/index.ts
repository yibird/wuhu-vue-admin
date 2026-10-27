import { apiRequest } from '@/utils'

export interface DownloadProgress {
  /**
   * 下载进度,取值 0-1
   */
  percent: number
  /**
   * 已下载字节数
   */
  transferredBytes: number
  /**
   * 文件总字节数,服务端未返回时可能是 0
   */
  totalBytes: number
}

/**
 * 下载文件并回调下载进度
 *
 * @param url 下载地址
 * @param callback 下载进度回调,`percent` 取值 0-1
 * @param signal 用于取消下载的 AbortSignal
 * @returns 下载完成的 Blob
 */
export async function downloadWithProgress(
  url: string,
  callback?: (progress: DownloadProgress) => void,
  signal?: AbortSignal
) {
  const response = await apiRequest<Response>(url, {
    responseType: 'response',
    signal,
    onDownloadProgress(progress) {
      callback?.({
        percent: progress.percent,
        transferredBytes: progress.transferredBytes,
        totalBytes: progress.totalBytes,
      })
    },
  })
  return response.blob()
}
