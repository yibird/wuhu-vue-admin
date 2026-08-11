<template>
  <a-tooltip title="记事本">
    <button
      type="button"
      class="w-layout-toolbar-item xs:hidden!"
      data-motion="tilt"
      @click="show = true"
    >
      <Icon name="i-lucide:book-marked" :size="20" />
    </button>
  </a-tooltip>
  <NoteBookModal v-model:show="show" />
</template>
<script lang="ts" setup>
const NoteBookModal = defineAsyncComponent(
  () => import('@/layouts/config/noteBookModal/index.vue')
)
const show = shallowRef(false)
</script>
