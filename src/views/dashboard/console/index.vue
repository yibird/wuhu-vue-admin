<template>
  <a-space direction="vertical" :gutter="12" class="w-full">
    <CardList :items="cards" />
    <Statistics />
    <a-row :gutter="10">
      <a-col :span="8" v-for="item in chartData">
        <a-card
          :title="item.title"
          :headStyle="{ minHeight: 'auto' }"
          :bodyStyle="{ padding: '10px' }"
        >
          <component :is="item.component" />
        </a-card>
      </a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
  import CardList from './components/CardList.vue';
  import Statistics from './components/Statistics.vue';
  import ConversionRate from './components/ConversionRate.vue';
  import AccessSource from './components/AccessSource.vue';
  import SalesProduct from './components/SalesProduct.vue';
  import { cards } from './dataSource';

  const chartData = [
    {
      title: '转化率',
      data: [],
      component: ConversionRate,
    },
    {
      title: '访问来源',
      data: [],
      component: AccessSource,
    },
    {
      title: '成交占比',
      data: [],
      component: SalesProduct,
    },
  ];
</script>
