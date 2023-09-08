import { computed, unref } from 'vue';
import { Router } from 'vue-router';
import { Menu } from '/@/router/types';
import { useMultipleTabStore } from '/@/store';

enum TabActionEnum {
  // 刷新当前页
  REFRESH,
  // 关闭当前页
  CLOSE_CURRENT,
  // 关闭左侧页
  CLOSE_LEFT,
  // 关闭右侧页
  CLOSE_RIGHT,
  // 关闭其他
  CLOSE_OTHER,
  // 关闭所有
  CLOSE_ALL,
}

export default function useTabs(router?: Router) {
  const { currentRoute } = router || {};
  const tabStore = useMultipleTabStore();

  const activeKey = computed(() => tabStore.currentTab?.id);

  // 获取当前tab
  function getCurrentTab() {
    const route = unref(currentRoute);
    return tabStore.getTabList.find((item) => item.path === route?.fullPath);
  }

  function addTab(item: Menu) {
    tabStore.addTab(item, router!);
  }

  function tabActionHandle(action: TabActionEnum) {
    const currentTab = getCurrentTab();
    switch (action) {
      case TabActionEnum.REFRESH:
        break;
      case TabActionEnum.CLOSE_CURRENT:
        break;
      case TabActionEnum.CLOSE_LEFT:
        break;
      case TabActionEnum.CLOSE_RIGHT:
        break;
      case TabActionEnum.CLOSE_OTHER:
        break;
      case TabActionEnum.CLOSE_ALL:
        break;
      default:
        break;
    }
  }
  return {
    activeKey,
    addTab,
    refreshPage: () => tabActionHandle(TabActionEnum.REFRESH),
    closeCurrentPage: () => tabActionHandle(TabActionEnum.CLOSE_CURRENT),
    closeLeftPage: () => tabActionHandle(TabActionEnum.CLOSE_LEFT),
    closeRightPage: () => tabActionHandle(TabActionEnum.CLOSE_LEFT),
    closeOtherPage: () => tabActionHandle(TabActionEnum.CLOSE_OTHER),
    closeAllPage: () => tabActionHandle(TabActionEnum.CLOSE_ALL),
  };
}
