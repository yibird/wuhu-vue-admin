<template>
  <div
    class="full flex flex-col items-center justify-center gap-24 overflow-auto px-24 py-36 text-center md:(flex-row gap-40 text-left)"
  >
    <img
      v-if="props.image"
      :src="props.image"
      :alt="props.imageAlt"
      class="h-auto w-full max-w-400"
    />
    <div class="min-w-0 max-w-840 py-12 md:px-24">
      <div class="text-lg text-main font-600">
        <slot v-if="slots.title" name="title" />
        <div v-else>{{ props.title }}</div>
      </div>
      <div v-if="showDesc" class="mt-10 text-md text-secondary">
        <slot v-if="slots.description" name="description" />
        <div v-else>{{ props.description }}</div>
      </div>
      <div v-if="props.showBtn" class="mt-20">
        <a-button type="primary" @click="handleButtonClick">
          {{ props.buttonText }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTabs } from '@/hooks'
import type { ExceptionProps, ExceptionSlots } from './types'

const props = withDefaults(defineProps<ExceptionProps>(), {
  buttonText: '返回首页',
  description: '',
  imageAlt: '',
  showBtn: true,
  title: '',
})
const slots = defineSlots<ExceptionSlots>()

const showDesc = computed(() => {
  return !!slots.description || !!props.description
})

const { openHomeTab } = useTabs()

function handleButtonClick() {
  if (props.onClick) {
    props.onClick()
    return
  }
  openHomeTab()
}
</script>
