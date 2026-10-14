<template>
  <a-tooltip title="记事本">
    <button
      type="button"
      class="w-layout-toolbar-item max-sm:hidden"
      data-motion="tilt"
      @click="show = true"
    >
      <Icon name="i-lucide:book-marked" :size="20" />
    </button>
  </a-tooltip>
  <NoteBookModal v-if="loaded" v-model:show="show" />
</template>
<script lang="ts" setup>
import { NoteBookModal } from '@/layouts/config'

defineOptions({ name: 'NoteBook' })

const show = shallowRef(false)
const loaded = shallowRef(false)

// 首次打开后再挂载，避免 async chunk 在布局初始化时就被加载
watch(show, (value) => {
  if (value) loaded.value = true
})
</script>
