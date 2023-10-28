<!-- table大小 -->
<template>
  <a-tooltip>
    <template #title>大小</template>
    <a-dropdown placement="bottom">
      <template #overlay>
        <a-menu @click="handleClick" :selectedKeys="[size]">
          <a-menu-item v-for="item in sizes" :key="item.value">
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </template>
      <Icon name="ri-font-size" :size="20" />
    </a-dropdown>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { inject } from 'vue';
  import { ContextType, TablePlusProps } from '../../types';
  const { size, changeSize } = inject<ContextType>('context')!;

  const sizes = [
    {
      title: '默认',
      value: 'default',
    },
    {
      title: '中等',
      value: 'middle',
    },
    {
      title: '紧凑',
      value: 'small',
    },
  ];
  const handleClick = ({ key }: { key: TablePlusProps['size'] }) => {
    changeSize(key);
  };
</script>
