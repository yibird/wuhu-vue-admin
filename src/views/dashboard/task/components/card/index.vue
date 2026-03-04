<template>
  <n-grid
    :x-gap="10"
    :y-gap="10"
    responsive="screen"
    item-responsive
    class="h-full overflow-hidden"
  >
    <n-grid-item
      v-for="(item, index) in taskStatus"
      :key="index"
      span="xs:24 s:12 m:8 lg:8 xl:6 xxl:4"
      class="xl:max-h-full xl:overflow-hidden"
    >
      <Group v-bind="item" :items="groupItems[item.status]" />
    </n-grid-item>
  </n-grid>
</template>
<script lang="ts" setup>
import { groupBy } from 'es-toolkit';
import Group from './group.vue';
import type { TaskProps } from '../types';

const taskStatus = [
  {
    text: '进行中',
    status: 1,
    color: '#1677FF',
    textColor: '#fff',
  },
  {
    text: '已完成',
    status: 2,
    color: '#87d068',
    textColor: '#fff',
  },
  {
    text: '已暂停',
    status: 3,
    color: '#ff4d4f',
    textColor: '#fff',
  },
  {
    color: '#ddd',
    text: '已过期',
    status: 4,
  },
];
const { items = [] } = defineProps<TaskProps>();
const groupItems = computed(() => groupBy(items, (item) => item.status));
</script>
