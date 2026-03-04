<template>
  <n-button-group size="small">
    <n-button
      v-for="item in items"
      :key="item.value"
      :type="value === item.value ? 'primary' : 'default'"
      @click="onClick(item.value)"
      >{{ item.label }}</n-button
    >
  </n-button-group>
</template>
<script lang="ts" setup>
import type { CardItemExtraEmits } from '../types';
const items = [
  {
    label: '年',
    value: 'year',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '日',
    value: 'day',
  },
];
const emis = defineEmits<CardItemExtraEmits>();
const value = ref('year');
const onClick = (val: string) => {
  value.value = val;
  emis('change', val);
};
</script>
