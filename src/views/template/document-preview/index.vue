<template>
  <WView class="full-flex">
    <div
      ref="viewerRef"
      data-testid="document-viewer"
      class="full min-h-0 min-w-0"
    />
  </WView>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef, useTemplateRef } from 'vue'
import { useDeferred } from '@/composables'
import type { ViewerInstance } from 'jit-viewer'

const viewerRef = useTemplateRef<HTMLElement>('viewerRef')
const viewerInstance = shallowRef<ViewerInstance>()

let viewerStylePromise: Promise<void> | undefined

async function loadViewerStyle() {
  if (document.getElementById('jit-viewer-style')) return

  viewerStylePromise ??= import('jit-viewer/style.css?url').then(
    ({ default: href }) =>
      new Promise<void>((resolve, reject) => {
        const link = document.createElement('link')
        link.id = 'jit-viewer-style'
        link.rel = 'stylesheet'
        link.href = href
        link.addEventListener('load', () => resolve(), { once: true })
        link.addEventListener(
          'error',
          () => reject(new Error('Failed to load jit-viewer styles')),
          {
            once: true,
          }
        )
        document.head.append(link)
      })
  )

  return viewerStylePromise
}

const { cancel: cancelCreateViewer } = useDeferred(async () => {
  if (!viewerRef.value || viewerInstance.value) return

  const [{ createViewer }] = await Promise.all([
    import('jit-viewer'),
    loadViewerStyle(),
  ])

  const viewer = createViewer({
    target: viewerRef.value,
    file: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    theme: 'light',
    toolbar: true,
    width: '100%',
    height: '100%',
  })

  viewerInstance.value = viewer
  await viewer.mount()
})

onBeforeUnmount(() => {
  cancelCreateViewer()
  viewerInstance.value?.destroy()
  viewerInstance.value = undefined
})
</script>
