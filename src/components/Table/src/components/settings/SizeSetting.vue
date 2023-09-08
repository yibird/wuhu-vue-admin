<!-- table大小 -->
<template>
  <a-tooltip>
    <template #title>大小</template>
    <a-dropdown placement="bottom">
      <template #overlay>
        <a-menu @click="handleClick" :selectedKeys="[config.size]">
          <a-menu-item v-for="item in sizes" :key="item.value">
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </template>
      <a-button shape="circle" type="primary">
        <template #icon>
          <Icon name="ri-font-size" />
        </template>
      </a-button>
    </a-dropdown>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { inject } from "vue";
  import { contextKey } from "../../context";
  import { TableSize } from "../../types/table";
  const { config = { size: "default" }, changeConfig } = inject(contextKey)!;

  const sizes = [
    {
      title: "默认",
      value: "default",
    },
    {
      title: "中等",
      value: "middle",
    },
    {
      title: "紧凑",
      value: "small",
    },
  ];
  const handleClick = ({ key }: { key: TableSize }) => {
    changeConfig({ ...config, size: key });
  };
</script>
