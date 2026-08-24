<template>
  <a-tooltip title="任务中心">
    <button
      type="button"
      class="w-layout-toolbar-item"
      data-motion="tilt"
      @click="show = true"
    >
      <Icon name="i-lucide:list-checks" :size="20" />
    </button>
  </a-tooltip>
  <TaskCenter v-model:show="show" />
</template>
<script lang="ts" setup>
const TaskCenter = defineAsyncComponent(
  () => import('@/layouts/config/taskCenter/index.vue')
)
const show = ref(false)
</script>
