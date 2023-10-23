<template>
  <a-menu
    mode="inline"
    theme="dark"
    @click="clickHandle"
    :selectedKeys="selectedKeys"
    :openKeys="openKeys"
  >
    <template v-for="item in menus" :key="item.id">
      <SubMenu :item="item" v-if="item.children" />
      <a-menu-item
        :key="item.id.toString()"
        v-else
        :path="item.path"
        :option="item"
      >
        <template #icon>
          <Icon :name="item.icon" />
        </template>
        {{ item.name }}
      </a-menu-item>
    </template>
  </a-menu>
</template>
<script setup lang="ts">
  import { menus } from '/@/common/menu';
  import SubMenu from './components/SubMenu.vue';
  import { ClickHandleParams } from './types';
  import { useLayoutMenu } from './useLayoutMenu';

  const { openKeys, selectedKeys, addTab } = useLayoutMenu();
  const clickHandle = ({ item, key, keyPath }: ClickHandleParams) => {
    if (item.path.length === 0) return;
    addTab(item.option);
  };
</script>
