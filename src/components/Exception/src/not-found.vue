<template>
  <Exception
    title="抱歉，您访问的页面不存在"
    :image="image"
    @click="openHomeTab"
  />
</template>
<script lang="ts" setup>
import { useTabs } from '@/composables'
import Exception from './exception.vue'
import image from '@/assets/svg/404.svg'

const { openHomeTab } = useTabs()
</script>
