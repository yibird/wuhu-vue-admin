import { computed, onScopeDispose, shallowRef } from 'vue'

/** 单次可添加的图片数量上限 */
export const MAX_IMAGE_COUNT = 9

/** 单张图片的体积上限，单位字节 */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024

interface UseImageAttachmentsOptions {
  maxCount?: number
  maxSize?: number
  onExceed?: (exceedCount: number) => void
  onOversize?: () => void
  onError?: () => void
}

/** 管理待发送图片和 FileReader，组件卸载时会中止未完成的文件读取。 */
export function useImageAttachments(options: UseImageAttachmentsOptions = {}) {
  const maxCount = options.maxCount ?? MAX_IMAGE_COUNT
  const maxSize = options.maxSize ?? MAX_IMAGE_SIZE
  const imageList = shallowRef<string[]>([])
  const pendingCount = shallowRef(0)
  const readers = new Set<FileReader>()
  let disposed = false

  const imageRemainingCount = computed(() =>
    Math.max(0, maxCount - imageList.value.length - pendingCount.value)
  )

  function addImages(files: File[]) {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.some((file) => file.size > maxSize)) options.onOversize?.()

    const validImageFiles = imageFiles.filter((file) => file.size <= maxSize)
    const availableCount = imageRemainingCount.value
    if (validImageFiles.length > availableCount) {
      options.onExceed?.(validImageFiles.length - availableCount)
    }
    if (!availableCount) return

    validImageFiles.slice(0, availableCount).forEach((file) => readImage(file))
  }

  function readImage(file: File) {
    const reader = new FileReader()
    readers.add(reader)
    pendingCount.value = readers.size
    reader.addEventListener(
      'load',
      () => {
        removeReader(reader)
        if (disposed) return
        const result = reader.result
        if (typeof result !== 'string' || imageList.value.length >= maxCount) {
          return
        }
        imageList.value = [...imageList.value, result]
      },
      { once: true }
    )
    reader.addEventListener(
      'error',
      () => {
        removeReader(reader)
        if (!disposed) options.onError?.()
      },
      { once: true }
    )
    reader.addEventListener('abort', () => removeReader(reader), {
      once: true,
    })
    reader.readAsDataURL(file)
  }

  function removeReader(reader: FileReader) {
    readers.delete(reader)
    pendingCount.value = readers.size
  }

  function removeImage(index: number) {
    imageList.value = imageList.value.filter(
      (_, imageIndex) => imageIndex !== index
    )
  }

  function clearImages() {
    imageList.value = []
  }

  onScopeDispose(() => {
    disposed = true
    for (const reader of readers) reader.abort()
    readers.clear()
    pendingCount.value = 0
  })

  return {
    imageList,
    imageRemainingCount,
    addImages,
    clearImages,
    removeImage,
  }
}
