<template>
  <n-card title="系统状态">
    <n-grid responsive="screen" item-responsive>
      <n-gi v-for="(item, index) in items" :key="index" span="xs:24 s:24 m:24 l:6 xxl:6">
        <Item :item="item" />
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script lang="ts" setup>
  import Item from './item.vue'
  import type { StatusProps } from '../types'
  const { items = [] } = defineProps<StatusProps>()
</script>
