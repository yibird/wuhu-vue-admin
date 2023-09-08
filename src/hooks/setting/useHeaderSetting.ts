import { computed } from "vue";
import { useAppStore } from "/@/store";

export function useHeaderSetting() {
  const appStore = useAppStore();
  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);
  return {
    getCollapsed,
  };
}
