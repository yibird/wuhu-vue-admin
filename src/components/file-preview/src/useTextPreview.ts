import { shallowRef, watch, type ComputedRef } from 'vue'

import type { FilePreviewKind, FilePreviewLocale } from './types'

class TextPreviewLimitError extends Error {}

interface UseTextPreviewOptions {
  open: ComputedRef<boolean>
  kind: ComputedRef<FilePreviewKind>
  url: ComputedRef<string | null>
  size: ComputedRef<number>
  maxBytes: ComputedRef<number>
  locale: ComputedRef<FilePreviewLocale>
}

async function readLimitedText(
  response: Response,
  maxBytes: number,
  signal: AbortSignal
) {
  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new TextPreviewLimitError()
  }

  if (!response.body) {
    const blob = await response.blob()
    if (blob.size > maxBytes) throw new TextPreviewLimitError()
    return blob.text()
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let receivedBytes = 0

  try {
    while (true) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
      const { done, value } = await reader.read()
      if (done) break
      receivedBytes += value.byteLength
      if (receivedBytes > maxBytes) throw new TextPreviewLimitError()
      chunks.push(value)
    }
  } finally {
    if (signal.aborted || receivedBytes > maxBytes) void reader.cancel()
  }

  const bytes = new Uint8Array(receivedBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function useTextPreview(options: UseTextPreviewOptions) {
  const content = shallowRef('')
  const loading = shallowRef(false)
  const error = shallowRef('')

  watch(
    () => [options.open.value, options.kind.value, options.url.value] as const,
    ([open, kind, url], _, onCleanup) => {
      content.value = ''
      error.value = ''
      loading.value = false
      if (!open || kind !== 'text') return

      if (!url) {
        error.value = options.locale.value.missingTextUrl
        return
      }

      const maxBytes = Math.max(1, options.maxBytes.value)
      if (options.size.value > maxBytes) {
        error.value = options.locale.value.textTooLarge(formatBytes(maxBytes))
        return
      }

      const controller = new AbortController()
      onCleanup(() => controller.abort())
      loading.value = true

      void fetch(url, {
        credentials: 'same-origin',
        referrerPolicy: 'no-referrer',
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return readLimitedText(response, maxBytes, controller.signal)
        })
        .then((value) => {
          if (!controller.signal.aborted) content.value = value
        })
        .catch((cause: unknown) => {
          if (controller.signal.aborted) return
          error.value =
            cause instanceof TextPreviewLimitError
              ? options.locale.value.textTooLarge(formatBytes(maxBytes))
              : options.locale.value.textLoadFailed
        })
        .finally(() => {
          if (!controller.signal.aborted) loading.value = false
        })
    },
    { immediate: true }
  )

  return { content, error, loading }
}
