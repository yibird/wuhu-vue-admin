import { defineStore, storeToRefs } from 'pinia'
import {
  HeaderWidget,
  Locale,
  MenuMode,
  SiderTheme,
  TabsTheme,
  ThemeMode,
  PageAnimation,
  LoadingAnimation,
  PageAnimationMode,
} from '@/constants'
import logo from '@/assets/svg/logo.svg'
import type { AppState } from './types'

const createInitialState = (): AppState => {
  return {
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
      fixed: true,
      showBreadcrumb: true,
      showBreadCrumbIcon: true,
      widgets: [
        HeaderWidget.Search,
        HeaderWidget.TaskCenter,
        HeaderWidget.DownloadCenter,
        HeaderWidget.NoteBook,
        HeaderWidget.Theme,
        HeaderWidget.Translate,
        HeaderWidget.Notice,
        HeaderWidget.LockScreen,
        HeaderWidget.FullScreen,
        HeaderWidget.Setting,
        HeaderWidget.AI,
      ],
    },
    tab: {
      show: true,
      showIcon: true,
      enableDrag: true,
      enablePersist: true,
      theme: TabsTheme.Block,
    },
    footer: { show: false, fixed: false },
    animation: {
      enableProgressBar: true,
      enablePageLoading: true,
      loadingAnimation: LoadingAnimation.Beat,
      pageAnimation: PageAnimation.SlideLeft,
      pageAnimationMode: PageAnimationMode.DEFAULT,
    },
    lockscreen: {},
    app: {
      name: 'Wuhu-admin',
      logo,
      themeMode: ThemeMode.Light,
      themeColor: '22, 119, 255',
      locale: Locale.ZH_CN,
      menuMode: MenuMode.Vertical,
      pageCache: true,
      pageCacheMax: 10,
      showWatermark: true,
      checkUpdate: true,
      borderRadius: 2,
      colourWeakness: false,
      greyMode: false,
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
}

export const appStore = defineStore('app', {
  state: createInitialState,
  actions: {
    setCollapsed(collapsed: boolean) {
      this.sider.collapsed = collapsed
    },
    toggleCollapsed() {
      this.setCollapsed(!this.sider.collapsed)
    },
  },
  persist: {
    omit: ['app.logo'],
    afterHydrate: ({ store }) => {
      store.app.logo = logo
    },
  },
})

export const useAppStore = () => {
  const store = appStore()
  return { ...store, ...storeToRefs(store) }
}
