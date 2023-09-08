import { computed, unref } from 'vue';
import { Router, useRouter } from 'vue-router';
import { Menu } from '/@/router/types';
import { useMultipleTabStore } from '/@/store/module/multipleTab';

export default function useTab(router: Router) {
  const { currentRoute } = router;
  const tabStore = useMultipleTabStore();

  const { refreshPage, closeCurrentTab, closeLeftTab, closeRightTab, closeOtherTab } = tabStore;

  const activeKey = computed(() => tabStore.currentTab?.id);

  // 获取当前tab
  function getCurrentTab() {
    const route = unref(currentRoute);
    return tabStore.getTabList.find((item) => item.path === route?.fullPath);
  }

  function addTab(item: Menu) {
    tabStore.addTab(item, router!);
  }

  return {
    activeKey,
    addTab,
    refreshPage: () => refreshPage(router!),
    closeCurrentPage: () => closeCurrentTab(router),
    closeLeftPage: () => closeLeftTab(),
    closeRightPage: () => closeRightTab(),
    closeOtherPage: () => closeOtherTab(),
    // closeAllPage: () => tabActionHandle(TabActionEnum.CLOSE_ALL),
  };
}
