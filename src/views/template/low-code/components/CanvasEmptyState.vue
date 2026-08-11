<script setup lang="ts">
defineEmits<{
  add: []
}>()
</script>

<template>
  <div
    class="min-h-[calc(100vh-220px)] flex flex-col items-center justify-center rounded-8 border-1 border-dashed border-color-2 bg-fill-quaternary px-20 py-36 text-center"
  >
    <div
      class="size-54 flex items-center justify-center rounded-14 icon-primary-soft"
    >
      <Icon name="i-lucide:layout-template" :size="26" />
    </div>
    <div class="mt-14 text-base text-main font-700">画布为空</div>
    <div class="mt-6 max-w-320 text-sm text-secondary leading-22px">
      从左侧拖入组件开始搭建，也可以先添加一个基础组件。
    </div>
    <button
      type="button"
      class="mt-16 h-34 inline-flex cursor-pointer items-center gap-6 rounded-8 border-0 bg-primary px-12 text-sm text-white transition-opacity hover:opacity-88"
      @click="$emit('add')"
    >
      <Icon name="i-lucide:plus" :size="16" />
      添加组件
    </button>
  </div>
</template>
