import { apiRequest } from './http'
import { CONTENT_TYPE, HTTP_METHOD } from '@/constants'

/**
 * 通过 Blob 数据触发浏览器文件下载
 *
 * @param {Blob} blob - 包含文件内容的 Blob 对象（需确保 MIME 类型正确）
 * @param {string} filename - 下载保存的文件名
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 将 JSON 对象下载为本地文件
 *
 * @param {Record<string, any>} data - 需要导出的 JSON 数据对象
 * @param {string} filename - 下载的文件名(建议以 .json 结尾)
 *
 * @example downloadJSON({ name: '张三', age: 18 }, 'user-info.json');
 */
export function downloadJSON(data: Record<string, any>, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
  downloadBlob(blob, filename)
}

/**
 * 将 HTMLCanvasElement 画布内容下载为图片 (PNG/JPG)
 *
 * @param {HTMLCanvasElement} canvas - 画布 DOM 元素
 * @param {string} filename - 下载的文件名（如 `poster.png`）
 * @param {string} [type='image/png'] - 图片格式，默认为 png
 * @param {number} [quality=1] - 图片质量（仅对 image/jpeg 和 image/webp 有效，0-1 之间）
 *
 * @example
 * const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
 * downloadCanvas(canvas, '海报.png', 'image/jpeg', 0.9);
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  type: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 1
) {
  if (!canvas) return console.warn('未找到 Canvas 元素')
  canvas.toBlob(
    (blob) => {
      if (blob) {
        downloadBlob(blob, filename)
      } else {
        console.error('Canvas 转 Blob 失败，可能画布为空或跨域受限')
      }
    },
    type,
    quality
  )
}

export interface DownloadRangeOptions {
  /** 文件下载地址 */
  url: string
  /** 分段起始字节下标，包含该字节 */
  start: number
  /** 分段结束字节下标，包含该字节 */
  end: number
  /** 整个文件的总字节数 */
  total: number
  /** 用于取消当前分段下载的信号 */
  signal?: AbortSignal
  /**
   * 下载进度回调，进度范围为 0 到 1。进度表示整个文件的下载进度，而非当前分段的进度。
   */
  onProgress?: (percent: number) => void
}

/**
 * 通过 HTTP Range 请求下载文件的指定字节区间(分段下载)。
 *
 * start 和 end 均为闭区间字节下标，例如 bytes=0-1023 表示下载前 1024 字节。下载过程中通过 onProgress
 * 回调报告整个文件的累计下载进度。支持通过 AbortSignal 取消当前分段下载。
 *
 * @param options - 分段下载配置
 * @returns 当前分段下载完成后的 Blob
 */
export async function downloadRange({
  url,
  start,
  end,
  total,
  signal,
  onProgress,
}: DownloadRangeOptions): Promise<Blob> {
  const rangeSize = end - start + 1
  return apiRequest<Blob>(url, {
    method: HTTP_METHOD.Get,
    responseType: CONTENT_TYPE.Blob,
    signal,
    headers: {
      Range: `bytes=${start}-${end}`,
    },
    onDownloadProgress(progress) {
      // 文件总大小无效时，无法计算整体下载进度
      if (total <= 0) return
      // 限制已传输字节数，避免进度超过当前分段的范围
      const transferredBytes = Math.min(
        Math.max(progress.transferredBytes, 0),
        rangeSize
      )
      // 计算整个文件的累计下载进度，并限制在 0 到 1 之间
      const percent = Math.min((start + transferredBytes) / total, 1)
      onProgress?.(percent)
    },
  })
}
