import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Menu } from '/@/router/types';
import { useMultipleTabStore } from '/@/store';

export function useLayoutMenu() {
  const tabStore = useMultipleTabStore();
  const selectedKeys = computed(() => [String(tabStore.currentTab?.id)]);
  const openKeys = computed(() => {
    return tabStore.currentTab?.levelPath.split('-');
  });

  const router = useRouter();
  function init() {
    tabStore.addTabById('11');
  }
  function addItem(menu: Menu) {
    tabStore.addTab(menu, router);
  }
  function addItemById(id: string) {
    tabStore.addTabById(id);
  }
  return {
    openKeys,
    selectedKeys,
    init,
    addItem,
    addItemById,
  };
}
