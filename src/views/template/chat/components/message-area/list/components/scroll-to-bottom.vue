<template>
  <Transition name="fade">
    <button
      v-if="props.show"
      type="button"
      class="button fixed bottom-180 right-100 z-10 size-34 rounded-full b-1-muted bg-container text-secondary shadow-all-md transition-colors hover:(bg-hover text-primary)"
      title="滚动到底部"
      aria-label="滚动到底部"
      @click="emits('click')"
    >
      <Icon name="i-lucide:chevron-down" :size="18" />
    </button>
  </Transition>
</template>
<script lang="ts" setup>
const props = defineProps<{
  /**
   * @desc 是否显示按钮
   */
  show: boolean
}>()

const emits = defineEmits<{
  /**
   * @desc 点击滚动到底部
   */
  click: []
}>()
</script>
