import { defineStore } from 'pinia'
import { Locale, MenuMode, SiderTheme, TabsTheme, ThemeMode } from '@/constant'

import type { AppState } from './types'

const initialState: AppState = {
  sider: {
    show: true,
    theme: SiderTheme.Dark,
    fixed: false,
    width: 240,
    collapsed: false,
    collapsedWidth: 60,
    showLogo: true,
    showSearch: true,
    showAdvancedNav: true,
  },
  header: {
    show: true,
    showBreadcrumb: true,
    showBreadCrumbIcon: true,
    widgets: [],
  },
  tabs: {
    show: true,
    showIcon: true,
    enableDrag: true,
    enablePersist: true,
    theme: TabsTheme.Card,
  },
  footer: {
    show: false,
    fixed: false,
  },
  animation: {
    enableProgressBar: true,
    enablePageLoading: true,
    pageAnimation: 'slide-left',
  },
  lockscreen: {},
  app: {
    name: 'Wuhu-admin',
    logo: 'https://unocss.dev/logo.svg',
    themeMode: ThemeMode.Light,
    themeColor: '24, 144, 255',
    locale: Locale.ZH_CN,
    menuMode: MenuMode.Vertical,
    pageCache: true,
    showWatermark: true,
    checkUpdate: true,
    borderRadius: 2,
  },
  copyright: {
    show: false,
    companyName: '呜呼科技',
    companyUrl: 'https://www.wohu.tech',
    icpNo: '粤ICP备2023000000号',
    icpUrl: 'https://beian.miit.gov.cn/',
    date: '2025',
  },
  shortcutKey: {
    enabled: true,
    search: true,
    logout: true,
    lockScreen: true,
  },
}

export const appStore = defineStore('app', {
  state() {
    return initialState
  },
  getters: {},
  actions() {},
  persist: true,
})
