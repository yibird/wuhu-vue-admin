<template>
  <n-grid :x-gap="10" :y-gap="10" cols="xs:1 s:1 m:2 l:4 xl:4" item-responsive responsive="screen">
    <n-gi v-for="(item, index) in items" :key="item.id">
      <Item :item="item" :index="index" />
    </n-gi>
  </n-grid>
</template>
<script lang="ts" setup>
import Item from './item.vue';
import type { CardListProps } from '../types';
const { items = [] } = defineProps<CardListProps>();
</script>
