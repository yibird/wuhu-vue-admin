import { computed } from "vue";
import { useAppStore } from "/@/store";
export function useMenuSetting() {
  const appStore = useAppStore();
  const getBgColor = computed(() => appStore.getMenuSetting.bgColor);
  const getFixed = computed(() => appStore.getMenuSetting.fixed);
  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);
  const getCanDrag = computed(() => appStore.getMenuSetting.canDrag);
  const getShow = computed(() => appStore.getMenuSetting.show);
  const getSplit = computed(() => appStore.getMenuSetting.split);
  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);
  const getCollapsedWidth = computed(
    () => appStore.getMenuSetting.collapsedWidth
  );
  const getMode = computed(() => appStore.getMenuSetting.mode);
  const getType = computed(() => appStore.getMenuSetting.type);
  const getTheme = computed(() => appStore.getMenuSetting.theme);
  const getTopMenuAlign = computed(() => appStore.getMenuSetting.topMenuAlign);
  const getTrigger = computed(() => appStore.getMenuSetting.trigger);
  const getAccordion = computed(() => appStore.getMenuSetting.accordion);
  const getCloseMixSidebarOnChange = computed(
    () => appStore.getMenuSetting.closeMixSidebarOnChange
  );
  const getCollapsedShowTitle = computed(
    () => appStore.getMenuSetting.collapsedShowTitle
  );
  const getMixSideTrigger = computed(
    () => appStore.getMenuSetting.mixSideTrigger
  );
  const getMixSideFixed = computed(() => appStore.getMenuSetting.mixSideFixed);
  return {
    getBgColor,
    getFixed,
    getCollapsed,
    getCanDrag,
    getShow,
    getSplit,
    getMenuWidth,
    getCollapsedWidth,
    getMode,
    getType,
    getTheme,
    getTopMenuAlign,
    getTrigger,
    getAccordion,
    getCloseMixSidebarOnChange,
    getCollapsedShowTitle,
    getMixSideTrigger,
    getMixSideFixed,
  };
}
