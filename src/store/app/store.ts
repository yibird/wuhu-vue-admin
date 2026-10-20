import { defineStore, storeToRefs } from 'pinia'
import {
  LOCALE,
  THEME_MODE,
  HEADER_WIDGET,
  MENU_MODE,
  SIDER_THEME,
  TAB_THEME,
  FONT_FAMILY,
  LOADING_ADNIMATION,
  PAGE_ANIMATION,
  PAGE_ANIMATION_MODE,
} from '@/constants'
import logo from '@/assets/svg/logo.svg'
import type { AppState } from './types'

/**
 * 应用名默认值,应用名为空时的文案兜底也复用该值
 */
export const DEFAULT_APP_NAME = 'Wuhu-admin'

const createInitialState = (): AppState => {
  return {
    sider: {
      show: true,
      theme: SIDER_THEME.Dark,
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
        HEADER_WIDGET.Search,
        HEADER_WIDGET.TaskCenter,
        HEADER_WIDGET.DownloadCenter,
        HEADER_WIDGET.NoteBook,
        HEADER_WIDGET.Theme,
        HEADER_WIDGET.Translate,
        HEADER_WIDGET.Notice,
        HEADER_WIDGET.LockScreen,
        HEADER_WIDGET.FullScreen,
        HEADER_WIDGET.Setting,
        HEADER_WIDGET.AI,
      ],
    },
    tabs: {
      show: true,
      showIcon: true,
      theme: TAB_THEME.Block,
    },
    footer: { show: false, fixed: false },
    animation: {
      enableProgressBar: true,
      enablePageLoading: true,
      loadingAnimation: LOADING_ADNIMATION.Beat,
      pageAnimation: PAGE_ANIMATION.SlideLeft,
      pageAnimationMode: PAGE_ANIMATION_MODE.OUT_INT,
    },
    lockscreen: {},
    app: {
      name: DEFAULT_APP_NAME,
      logo,
      themeMode: THEME_MODE.Light,
      themeColor: '22, 119, 255',
      locale: LOCALE.ZH_CN,
      fontFamily: FONT_FAMILY.Outfit,
      menuMode: MENU_MODE.Vertical,
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
