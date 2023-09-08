<!-- 列导出 -->
<template>
  <a-tooltip>
    <template #title>列导出</template>
    <a-popover trigger="click" placement="bottomRight" overlayClassName="ant-popover-custom">
      <template #content>
        <div class="panel-header">
          <div>
            <a-checkbox>全选</a-checkbox>
            <span>已选中<a-typography-link> 111 </a-typography-link>项</span>
          </div>
          <a-button :loading="loading" type="primary" size="small">导出</a-button>
        </div>
        <ul class="panel-list">
          <li v-for="item in columns" :key="item.prop">
            <a-checkbox>{{ item.label }}</a-checkbox>
          </li>
        </ul>
      </template>
      <a-button shape="circle" type="primary">
        <template #icon>
          <Icon name="ri-download-cloud-line" />
        </template>
      </a-button>
    </a-popover>
  </a-tooltip>
</template>
<script setup lang="ts">
import { ref } from 'vue';
  const loading = ref(true);
  const columns = [
    {
      prop: 'name',
      label: 'name',
    },
    {
      prop: 'age',
      label: 'age',
    },
  ];
</script>

<style scoped>
  .panel-header {
    @apply flex-y-center justify-between px-[15px] py-[8px];
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  }
  .panel-list {
    max-height: 300px;
    min-width: 260px;
    overflow-y: auto;
  }
  .panel-list li {
    @apply flex justify-between px-[15px] py-[5px];
  }
  .panel-list li:not(:last-child) {
    border-bottom: 1px solid #e2e2e2;
  }
</style>
