<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="clickHandle">
        <a-menu-item v-for="item in tabMenus" :key="item.key">
          <div class="flex align-items">
            <icon :size="16" :name="item.icon" />
            <span className="ml-[8px]">{{ item.title }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
    <div class="tabs-control">
      <icon :size="20" name="ri-arrow-down-s-line" size="{22}" />
    </div>
  </a-dropdown>
</template>
<script setup lang="ts">
  import { useRouter } from "vue-router";
  import useTab from "../hooks/useTab";
  const router = useRouter();

  const { refreshPage, closeCurrentPage, closeLeftPage, closeRightPage, closeOtherPage } =
    useTab(router);

  const tabMenus = [
    {
      key: "reload",
      icon: "ri-restart-line",
      title: "重新加载",
      handle: refreshPage,
    },
    {
      key: "close",
      icon: "ri-close-line",
      title: "关闭标签页",
      handle: closeCurrentPage,
    },
    {
      key: "closeLeft",
      icon: "ri-skip-back-fill",
      title: "关闭左侧标签页",
      handle: closeLeftPage,
    },
    {
      key: "closeRight",
      icon: "ri-skip-forward-fill",
      title: "关闭右侧标签页",
      handle: closeRightPage,
    },
    {
      key: "closeOther",
      icon: "ri-more-fill",
      title: "关闭其他标签页",
      handle: closeOtherPage,
    },
    // {
    //   key: 'closeAll',
    //   icon: 'ri-subtract-fill',
    //   title: '关闭全部侧标签页',
    //   handle: closeAllPage,
    // },
  ];
  const clickHandle = ({ key }: { key: string }) => {
    const tab = tabMenus.find((item) => item.key === key);
    tab?.handle();
  };
</script>
<style scoped>
  .tabs-control {
    @apply w-40 h-full cursor-pointer flex justify-center items-center;
  }
  .tabs-control i {
    font-size: 20px;
  }
</style>
