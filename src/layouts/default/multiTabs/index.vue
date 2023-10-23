<template>
  <div class="default-tabs">
    <div class="tab-control tab-prev">
      <icon :size="24" name="ri-arrow-left-s-line" />
    </div>
    <ul class="tab-wrapper" ref="tabRef">
      <li
        v-for="(item, index) in tabItems"
        :key="item.id"
        :class="[current === index && 'tab-active']"
        @click="changeTab(index)"
      >
        <span>{{ item.name }}</span>
        <icon
          :size="18"
          @click.stop="closeTab(index)"
          name="ri-close-fill"
          class="tab-close"
        />
      </li>
    </ul>
    <div class="tab-control tab-next">
      <icon :size="24" name="ri-arrow-right-s-line" />
    </div>
    <div class="tab-control tab-refresh">
      <icon :size="20" name="ri-restart-line" />
    </div>
    <a-dropdown>
      <template #overlay>
        <a-menu @click="clickHandle">
          <a-menu-item v-for="item in actions" :key="item.key">
            <div class="flex-col-center">
              <icon :size="16" :name="item.icon" />
              <span className="ml-8">{{ item.title }}</span>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
      <div class="tab-control tab-action">
        <icon :size="24" name="ri-arrow-down-s-line" />
      </div>
    </a-dropdown>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useTab } from './hooks/useTab';
  import { useRouter } from 'vue-router';

  const tabRef = ref<HTMLElement>();
  const router = useRouter();
  const {
    tabItems,
    current,
    refreshPage,
    changeTab,
    closeTab,
    closeCurrentTab,
    closeLeftTab,
    closeRightTab,
    closeOtherTab,
    closeAllTab,
  } = useTab(router);

  const actions = [
    {
      key: 'reload',
      icon: 'ri-restart-line',
      title: '重新加载',
      handle: refreshPage,
    },
    {
      key: 'closeCurrent',
      icon: 'ri-close-line',
      title: '关闭标签',
      handle: closeCurrentTab,
    },
    {
      key: 'closeLeft',
      icon: 'ri-skip-back-fill',
      title: '关闭左侧标签',
      handle: closeLeftTab,
    },
    {
      key: 'closeRight',
      icon: 'ri-skip-forward-fill',
      title: '关闭右侧标签',
      handle: closeRightTab,
    },
    {
      key: 'closeOther',
      icon: 'ri-more-fill',
      title: '关闭其他标签',
      handle: closeOtherTab,
    },
    {
      key: 'closeAll',
      icon: 'ri-subtract-fill',
      title: '关闭全部侧标签',
      handle: closeAllTab,
    },
  ];

  function clickHandle({ key }: { key: string }) {
    actions.forEach((item) => item.key === key && item.handle());
  }
</script>
<style scoped>
  .default-tabs {
    position: relative;
    height: 40px;
    color: #333;
    background-color: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
  }
  .default-tabs .tab-control {
    position: absolute;
    top: 0;
    width: 40px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  .default-tabs .tab-control:not(:first-child) {
    border-left: 1px solid #f5f5f5;
  }
  .default-tabs .tab-control:first-child {
    border-right: 1px solid #f5f5f5;
  }
  .default-tabs .tab-prev {
    left: 0;
  }
  .default-tabs .tab-next {
    right: 80px;
  }
  .default-tabs .tab-refresh {
    right: 40px;
  }
  .default-tabs .tab-action {
    right: 0;
  }

  .default-tabs .tab-wrapper {
    position: relative;
    margin: 0 120px 0 40px;
    height: 100%;
    white-space: nowrap;
    transition: all 0.15s;
    list-style: none;
    overflow: hidden;
  }
  .default-tabs .tab-wrapper li {
    position: relative;
    float: left;
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    user-select: none;
    cursor: pointer;
    transition: all 0.1s;
  }
  .default-tabs .tab-wrapper li:not(:last-child) {
    border-right: 1px solid #f5f5f5;
  }
  .default-tabs .tab-wrapper li::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    border-radius: 0;
    background-color: #292b34;
    transition: all 0.2s;
    -webkit-transition: all 0.15 cubic-bezier(0.4, 0, 0.2, 1);
  }
  .default-tabs .tab-wrapper li:hover::before {
    width: 100%;
  }
  .default-tabs .tab-wrapper li span {
    font-size: 14px;
    line-height: 1.5;
  }
  .default-tabs .tab-wrapper li:hover span {
    font-weight: bold;
  }
  .default-tabs .tab-close {
    margin-left: 5px;
    font-size: 15px;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .default-tabs .tab-close:hover {
    color: red;
    font-weight: bold;
  }

  .default-tabs .tab-active {
    font-weight: bold;
  }
  .default-tabs .tab-active::before {
    width: 100% !important;
  }

  /** block theme */
  .block-tabs {
    position: relative;
    display: flex;
    align-items: center;
    height: 42px;
    color: #333;
  }
  .block-tabs .tab-control {
    position: absolute;
    top: 0;
    width: 40px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  .block-tabs .tab-prev {
    left: 0;
  }
  .block-tabs .tab-next {
    right: 80px;
  }
  .block-tabs .tab-refresh {
    right: 40px;
  }
  .block-tabs .tab-action {
    right: 0;
  }

  .block-tabs .tab-wrapper {
    position: relative;
    margin: 0 120px 0 40px;
    height: 32px;
    width: 100%;
    white-space: nowrap;
    transition: all 0.15s;
  }
  .block-tabs .tab-wrapper li {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
    padding: 0 15px;
    user-select: none;
    cursor: pointer;
    transition: all 0.1s;
  }
  .block-tabs .tab-wrapper li:not(:last-child) {
    margin-right: 10px;
  }
  .block-tabs .tab-wrapper li span {
    font-size: 14px;
    line-height: 1.5;
  }

  .block-tabs .tab-close {
    margin-left: 5px;
    font-size: 15px;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .block-tabs .tab-close:hover {
    color: red;
    font-weight: bold;
  }

  .block-tabs .tab-active {
    position: relative;
    color: #fff;
    background-color: #2d8cf0 !important;
    font-weight: 600;
    padding: 0 10px 0 25px !important;
  }
  .block-tabs .tab-active::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    left: 10px;
    top: 50%;
    border-radius: 50%;
    background-color: #fff;
    transform: translateY(-50%);
  }
</style>
