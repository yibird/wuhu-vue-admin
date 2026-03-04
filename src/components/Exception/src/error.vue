<template>
  <Exception
    title="抱歉，服务器发生了错误"
    :image="errorSvg"
    @click="openHomeTab"
  />
</template>
<script lang="ts" setup>
import { useTabs } from '@/composables'
import Exception from './exception.vue'
import errorSvg from '@/assets/svg/500.svg'

const { openHomeTab } = useTabs()
</script>
