<template>
  <div class="bg-white h-full">
    <a-tabs v-model:activeKey="activeKey" :tabBarStyle="{ padding: '0 10px' }">
      <a-tab-pane key="1" tab="基本设置">
        <BaseSetting />
      </a-tab-pane>
      <a-tab-pane key="2" tab="安全设置" force-render>
        <SecuritySetting />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import BaseSetting from './BaseSetting.vue';
  import SecuritySetting from './SecuritySetting.vue';
  const activeKey = ref('1');
</script>
