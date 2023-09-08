<template>
  <div class="tabs">
    <div class="tabs-control">
      <icon :size="20" name="ri-arrow-left-s-line" />
    </div>
    <div class="tabs-wrapper">
      <ul>
        <li
          v-for="(item, index) in getTabList"
          :key="item.id"
          :class="[activeKey === item.id && 'tab-active']"
          @click="addTab(item)"
        >
          <span>{{ item.name }}</span>
          <icon
            :size="18"
            v-if="closeable"
            @click.stop="closeTab(index)"
            name="ri-close-fill"
            class="tab-close"
          />
        </li>
      </ul>
    </div>
    <div class="tabs-control">
      <icon :size="20" name="ri-arrow-right-s-line" />
    </div>
    <TabAction />
  </div>
</template>
<script setup lang="ts">
  import { computed, unref } from "vue";
  import TabAction from "./components/TabsAction.vue";
  import { useMultipleTabStore } from "/@/store";
  import useTab from "./hooks/useTab";
  import { useRouter } from "vue-router";

  const tabStore = useMultipleTabStore();
  const router = useRouter();

  // 获取tabList,过滤hidden元素
  const getTabList = computed(() => tabStore.tabList.filter((item) => !item?.hidden));
  // tabList关闭状态
  const closeable = computed(() => unref(tabStore.tabList).length !== 1);
  const { activeKey, addTab } = useTab(router);

  function closeTab(index: number) {
    console.log("asdasd");
  }
</script>
<style scoped>
  .tabs {
    @apply flex h-[40px] bg-[#F0F2F5];
  }
  .tabs-wrapper {
    @apply flex-1;
  }
  .tabs-wrapper ul {
    @apply relative flex h-30 my-5 items-center gap-[8px] 
    whitespace-nowrap transition-all;
  }
  .tabs-wrapper ul li {
    @apply flex-y-center h-full bg-white px-[10px] rounded-[4px] cursor-pointer;
  }

  .tabs-control {
    @apply w-40 h-full cursor-pointer flex-center;
  }
  .tabs-control i {
    font-size: 20px;
  }
  .tab-close {
    @apply ml-6 text-[15px] transition-all hover:text-[red] font-[600];
  }
  .tab-active {
    @apply relative text-[#2d8cf0] font-[600] !pl-28 shadow-sm transition-all
    before:absolute
    before:content-[''] 
    before:w-8 before:h-8 
    before:left-10
    before:rounded-[50%] 
    before:bg-[#2d8cf0] 
    before:top-[50%] 
    before:translate-y-[-50%];
  }
</style>
