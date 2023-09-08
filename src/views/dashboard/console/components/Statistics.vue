<!-- 统计 -->
<template>
  <a-tabs class="bg-white" :tabBarStyle="{ padding: '0 20px' }">
    <a-tab-pane key="1" tab="流量趋势" class="p-20">
      <FlowTrend />
    </a-tab-pane>
    <a-tab-pane key="2" tab="访问量" force-render class="p-20">
      <Visits />
    </a-tab-pane>
  </a-tabs>
</template>
<script setup lang="ts">
  import FlowTrend from './FlowTrend.vue';
  import Visits from './Visits.vue';
</script>
