<template>
  <a-sub-menu :key="String(item.id)">
    <template #icon> <icon :name="item.icon" /> </template>
    <template #title>{{ item.name }}</template>
    <template v-for="childItem in item.children" :key="String(childItem.id)">
      <template v-if="childItem.children">
        <sub-menu :item="childItem" :key="String(childItem.id)" />
      </template>
      <template v-else>
        <a-menu-item :key="childItem.id.toString()" :path="childItem.path" :option="childItem">
          <template #icon>
            <icon :name="item.icon" />
          </template>
          {{ childItem.name }}
        </a-menu-item>
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup lang="ts">
  import type { Menu } from "/@/router/types";
  const { item = {} } = defineProps<{ item: Menu }>();
</script>
