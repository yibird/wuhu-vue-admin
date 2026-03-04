<template>
  <div class="full flex items-center justify-center">
    <img :src="image" alt="" class="w-400" />
    <div class="p-50">
      <div class="text-md">
        <slot name="title" v-if="slots.title" />
        <div v-else>{{ title }}</div>
      </div>
      <div v-if="showDesc" class="text-md text-gray-500 mt-10">
        <slot v-if="slots.description" name="description" />
        <div v-else>{{ description }}</div>
      </div>
      <div class="mt-20">
        <n-button type="primary" v-if="showBtn && !description" @click="onClick"
          >返回首页</n-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ExceptionProps, ExceptionSlots } from './types'

const {
  image,
  title,
  description,
  showBtn = true,
  onClick,
} = defineProps<ExceptionProps>()
const slots = defineSlots<ExceptionSlots>()

const showDesc = computed(() => {
  return slots.description || description
})
</script>
