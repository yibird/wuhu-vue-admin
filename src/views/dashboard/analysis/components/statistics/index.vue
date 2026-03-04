<template>
  <n-card content-style="padding: 0;">
    <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;" animated>
      <template #suffix>
        <div class="px-20 flex items-center gap-10">
          <n-radio-group name="radio-group-1">
            <n-radio-button
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :label="item.title"
            />
          </n-radio-group>
          <n-date-picker type="daterange" clearable class="w-240" />
        </div>
      </template>
      <n-tab-pane v-for="item in items" :name="item.name" :tab="item.title">
        <component :is="item.component" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
<script lang="ts" setup>
import salesRevenue from './sales-revenue.vue';
import visitCount from './visit-count.vue';
const items = [
  {
    name: 'salesRevenue',
    title: '销售额',
    component: salesRevenue,
  },
  {
    name: 'visitCount',
    title: '访问量',
    component: visitCount,
  },
];

const options = [
  {
    title: '今天',
    value: 'currentDay',
  },
  {
    title: '昨天',
    value: 'yesterday',
  },
  {
    title: '本周',
    value: 'week',
  },
  {
    title: '本月',
    value: 'month',
  },
  {
    title: '本季度',
    value: 'quarter',
  },
  {
    title: '本年',
    value: 'year',
  },
];
</script>
