import { computed } from "vue";
import { useAppStore } from "/@/store";

export function useRootSetting() {
  const appStore = useAppStore();
  const getPageLoading = computed(() => appStore.pageLoading);
  const getShowLogo = computed(() => appStore.getProjectConfig.showLogo);
  const getShowFooter = computed(() => appStore.getProjectConfig.showFooter);

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  return {
    getPageLoading,
    getShowLogo,
    getShowFooter,
    getCollapsed,
  };
}
