<template>
  <a-breadcrumb class="flex-y-center !px-8">
    <a-breadcrumb-item v-for="item in menus" :key="item.id">
      <span>{{ item.name }}</span>
      <template v-if="item.children" #overlay>
        <a-menu>
          <a-menu-item v-for="row in item.children" :key="row.id">
            <a>{{ row.name }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script setup lang="ts">
  import { computed } from "vue";
  import { useMultipleTabStore, usePermissionStore } from "/@/store";
  import { Menu } from "/@/router/types";

  const tabStore = useMultipleTabStore();
  const permissionStore = usePermissionStore();

  const flatMenus = computed(() => permissionStore.getFlatFrontMenus);
  const currentPath = computed(() => tabStore.getCurrentTab?.levelPath ?? "");

  const menus = computed(() => {
    return [] as Menu[];
    // return currentPath ? buildLevelTree(unref(flatMenus), unref(currentPath)) : [];
  });
</script>
