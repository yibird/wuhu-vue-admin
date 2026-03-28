<template>
  <div class="full p-10">
    <div ref="viewerRef" class="full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createViewer } from 'jit-viewer'
import 'jit-viewer/style.css'

const viewerRef = ref(null)
let viewerInstance = null

onMounted(() => {
  if (!viewerRef.value) return

  // 创建 Viewer 实例
  viewerInstance = createViewer({
    target: viewerRef.value,
    file: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    theme: 'light',
    toolbar: true,
    width: '100%',
    height: '100%',
    onReady: () => console.log('Viewer ready'),
    onLoad: () => console.log('File loaded'),
    onError: (err) => console.error('Error:', err),
  })

  viewerInstance.mount()
})

onUnmounted(() => {
  // 销毁实例
  viewerInstance?.destroy()
})
</script>
