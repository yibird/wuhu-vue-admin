import { Router } from 'vue-router';
import { Menu } from '/@/router/types';
import { useMultipleTabStore } from '/@/store/module/multipleTab';
import { storeToRefs } from 'pinia';

export function useTab(router: Router) {
  const store = useMultipleTabStore();
  const {
    handleAddTab,
    handleChangeTab,
    handleCloseTab,
    handleCloseCurrentTab,
    handleCloseLeftTab,
    handleCloseRightTab,
    handleCloseOtherTab,
    handleCloseAllTab,
    refreshPage,
  } = store;

  const { tabItems, current, getCurrentTab } = storeToRefs(store);

  function addTab(item: Menu) {
    handleAddTab(item, router);
  }
  function changeTab(index: number) {
    handleChangeTab(index, router);
  }
  function closeTab(index: number) {
    handleCloseTab(index, router);
  }
  function closeCurrentTab() {
    handleCloseCurrentTab(router);
  }
  function closeLeftTab() {
    handleCloseLeftTab();
  }
  function closeRightTab() {
    handleCloseRightTab();
  }
  function closeOtherTab() {
    handleCloseOtherTab();
  }
  function closeAllTab() {
    handleCloseAllTab(router);
  }

  return {
    tabItems,
    current,
    currentTab: getCurrentTab,
    addTab,
    changeTab,
    closeTab,
    closeCurrentTab,
    closeLeftTab,
    closeRightTab,
    closeOtherTab,
    closeAllTab,
    refreshPage: () => refreshPage(router!),
  };
}
