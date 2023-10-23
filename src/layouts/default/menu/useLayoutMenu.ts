import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTab } from '../multiTabs/hooks/useTab';

export function useLayoutMenu() {
  const router = useRouter();
  const { currentTab, addTab } = useTab(router);
  const selectedKeys = computed(() => {
    if (!currentTab.value) return [];
    return currentTab.value.levelPath.split('-');
  });
  const openKeys = computed(() => {
    if (!currentTab.value) return [];
    return currentTab.value.levelPath.split('-');
  });

  return {
    openKeys,
    selectedKeys,
    addTab,
  };
}
