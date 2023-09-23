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
    @apply flex h-40 bg-[#F0F2F5];
  }
  .tabs-wrapper {
    @apply flex-1;
  }
  .tabs-wrapper ul {
    @apply relative flex h-30 my-5 items-center gap-8
    whitespace-nowrap transition-all;
  }
  .tabs-wrapper ul li {
    @apply flex items-center h-full bg-white 
      px-10 cursor-pointer rounded-[4px];
  }

  .tabs-control {
    @apply w-40 h-full cursor-pointer flex justify-center items-center;
  }
  .tab-close {
    @apply ml-6 text-[15px] transition-all hover:text-[red] font-[600];
  }

  .tab-active{
    @apply relative text-[#2d8cf0] font-[600] !pl-28 shadow-sm transition-all;
  }
  .tab-active::before {
    content: '';
    position: absolute;
    width: 8px;
    height:8px;
    left:10px;
    top: 50%;
    border-radius: 50%;
    background-color: #2d8cf0;
    transform: translateY(-50%);
  }
</style>
