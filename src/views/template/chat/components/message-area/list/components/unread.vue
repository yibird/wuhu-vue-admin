<template>
  <Transition name="fade">
    <button
      v-if="show"
      type="button"
      class="button absolute right-16 top-10 z-10 flex items-center gap-4 rounded-full b-1-muted bg-container py-4 pl-8 pr-11 text-xs text-primary shadow-all-md transition-colors hover:bg-hover"
      title="定位到第一条未读消息"
      aria-label="定位到第一条未读消息"
      @click="emits('locate')"
    >
      <Icon name="i-lucide:arrow-down" :size="13" />
      {{ count }} 条未读消息
    </button>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  /**
   * @desc 是否显示未读提示条
   */
  show: boolean
  /**
   * @desc 未读消息数量
   */
  count: number
}>()

const emits = defineEmits<{
  /**
   * @desc 点击定位到第一条未读消息
   */
  locate: []
}>()
</script>
