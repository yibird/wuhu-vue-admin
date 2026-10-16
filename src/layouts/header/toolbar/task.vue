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
  <TaskCenter v-if="loaded" v-model:show="show" />
</template>
<script lang="ts" setup>
const TaskCenter = defineAsyncComponent(
  () => import('@/layouts/config/task-center/index.vue')
)
const show = ref(false)
const loaded = ref(false)

// 首次打开后再挂载，避免 async chunk 在布局初始化时就被加载
watch(show, (value) => {
  if (value) loaded.value = true
})
</script>
