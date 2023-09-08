<template>
  <a-dropdown>
    <template #overlay>
      <a-menu>
        <a-menu-item v-for="item in languages" :key="item.key">
          {{ item.label }}
        </a-menu-item>
      </a-menu>
    </template>
    <li>
      <icon name="ri-translate" />
    </li>
  </a-dropdown>
</template>
<script setup lang="ts">
  const languages = [
    {
      key: 1,
      label: '中文(简体)',
    },
    {
      key: 2,
      label: '英文',
    },
  ];
</script>
