<template>
  <Exception
    title="抱歉，您没有权限访问该页面"
    :image="image"
    @click="openHomeTab"
  />
</template>
<script lang="ts" setup>
import { useTabs } from '@/composables'
import Exception from './exception.vue'
import image from '@/assets/svg/403.svg'

const { openHomeTab } = useTabs()
</script>
