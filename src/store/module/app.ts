import { defineStore } from "pinia";
import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
} from "/#/config";
import { ThemeEnum } from "/@/enums/appEnum";
import { config } from "/@/common/config";

import { deepMerge } from "/@/utils";

type State = {
  // 暗黑模式
  darkMode?: ThemeEnum;
  // 页面loading status
  pageLoading: boolean;
  // 项目配置
  projectConfig: ProjectConfig;
};

const initialState = (): State => {
  return {
    darkMode: undefined,
    pageLoading: false,
    projectConfig: config,
  };
};

export const useAppStore = defineStore("app", {
  state: initialState,
  getters: {
    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig);
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
  },
  actions: {
    setDarkMode(darkMode: ThemeEnum) {
      this.darkMode = darkMode;
    },
    setPageLoading(loading: boolean) {
      this.pageLoading = loading;
    },
    setProjectConfig(config: DeepPartial<ProjectConfig>) {
      this.projectConfig = deepMerge(
        this.projectConfig || {},
        config
      ) as ProjectConfig;
    },
    setMenuSetting(menuSetting: MenuSetting) {
      this.projectConfig.menuSetting = menuSetting;
    },
  },
});
