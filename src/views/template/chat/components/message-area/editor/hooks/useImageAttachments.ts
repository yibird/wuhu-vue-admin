import { computed, onScopeDispose, shallowRef } from 'vue'

interface UseImageAttachmentsOptions {
  maxCount?: number
  maxSize?: number
  onOversize?: () => void
}

/** 管理待发送图片和 FileReader，组件卸载时会中止未完成的文件读取。 */
export function useImageAttachments(options: UseImageAttachmentsOptions = {}) {
  const maxCount = options.maxCount ?? 9
  const maxSize = options.maxSize ?? 10 * 1024 * 1024
  const imageList = shallowRef<string[]>([])
  const isImageDragging = shallowRef(false)
  const pendingCount = shallowRef(0)
  const readers = new Set<FileReader>()
  let disposed = false

  const imageRemainingCount = computed(() =>
    Math.max(0, maxCount - imageList.value.length - pendingCount.value)
  )

  function addImages(files: File[]) {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.some((file) => file.size > maxSize)) options.onOversize?.()

    const availableCount = imageRemainingCount.value
    if (!availableCount) return

    imageFiles
      .filter((file) => file.size <= maxSize)
      .slice(0, availableCount)
      .forEach((file) => readImage(file))
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
    reader.addEventListener('error', () => removeReader(reader), {
      once: true,
    })
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
    isImageDragging,
    addImages,
    clearImages,
    removeImage,
  }
}
