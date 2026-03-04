<template>
  <button
    class="span-button group inline-flex p-8 cursor-pointer rounded-4 hover:bg-[#f5f5f4] dark:hover:bg-[#2e3033]"
    @click="onClick"
  >
    <Icon name="i-lucide:align-justify" :size="18" class="transition group-hover:scale-110" />
  </button>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'

const { sider } = storeToRefs(appStore())

const onClick = () => {
  sider.value.collapsed = !sider.value.collapsed
}
</script>
