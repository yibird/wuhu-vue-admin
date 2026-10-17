<template>
  <div v-if="images.length > 0" class="mb-10 flex flex-wrap items-center gap-8">
    <div
      v-for="(img, index) in images"
      :key="img"
      class="group relative size-64 overflow-hidden rounded-8 border-1 border-solid border-color-1 bg-fill-quaternary"
    >
      <img :src="img" alt="待发送图片" class="full object-cover" />
      <button
        type="button"
        class="button absolute right-4 top-4 size-18 rounded-full bg-mask text-white opacity-0 transition-[opacity,colors] group-hover:opacity-100 hover:bg-mask-2"
        aria-label="移除待发送图片"
        @click="emits('remove', index)"
      >
        <Icon name="i-lucide:x" :size="12" />
      </button>
    </div>

    <button
      v-if="remainingCount > 0"
      type="button"
      class="button size-64 flex-col gap-4 rounded-8 border-1 border-dashed border-color-2 bg-fill-quaternary text-secondary transition-colors hover:(border-primary bg-primary/8 text-primary)"
      title="继续添加图片"
      aria-label="继续添加图片"
      @click="emits('add')"
    >
      <Icon name="i-lucide:plus" :size="18" />
      <span class="text-11px">添加</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ImageAttachmentListProps } from '../types'

defineProps<ImageAttachmentListProps>()

const emits = defineEmits<{
  add: []
  remove: [index: number]
}>()
</script>
