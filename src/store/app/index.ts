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
  FontFamily,
} from '@/constants'
import logo from '@/assets/svg/logo.svg'
import type { TabsConfig } from '#/config'
import type { AppState } from './types'

/**
 * 应用名默认值,应用名为空时的文案兜底也复用该值
 */
export const DEFAULT_APP_NAME = 'Wuhu-admin'

/**
 * 应用持久化数据在 localStorage 中的键名,与 store id 保持一致
 */
const PERSIST_KEY = 'app'

/**
 * 迁移旧版本持久化数据
 *
 * 早期版本的标签页配置以 tab 为键持久化,重命名为 tabs 后残留的旧键会被合并进 state,
 * 且新键缺失会导致老用户刷新后标签栏显示、图标、主题等个性化设置静默回退为默认值。
 */
function migrateLegacyPersistState() {
  const raw = window.localStorage.getItem(PERSIST_KEY)
  if (!raw) return

  try {
    const state = JSON.parse(raw) as Record<string, unknown>
    const legacyTabs = state.tab as Partial<TabsConfig> | undefined
    if (!legacyTabs || state.tabs) return

    state.tabs = {
      show: legacyTabs.show,
      showIcon: legacyTabs.showIcon,
      theme: legacyTabs.theme,
    }
    delete state.tab
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(state))
  } catch {
    window.localStorage.removeItem(PERSIST_KEY)
  }
}

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
    tabs: {
      show: true,
      showIcon: true,
      theme: TabsTheme.Block,
    },
    footer: { show: false, fixed: false },
    animation: {
      enableProgressBar: true,
      enablePageLoading: true,
      loadingAnimation: LoadingAnimation.Beat,
      pageAnimation: PageAnimation.SlideLeft,
      pageAnimationMode: PageAnimationMode.OUT_INT,
    },
    lockscreen: {},
    app: {
      name: DEFAULT_APP_NAME,
      logo,
      themeMode: ThemeMode.Light,
      themeColor: '22, 119, 255',
      locale: Locale.ZH_CN,
      fontFamily: FontFamily.Outfit,
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
    beforeHydrate: () => migrateLegacyPersistState(),
    afterHydrate: ({ store }) => {
      store.app.logo = logo
    },
  },
})

export const useAppStore = () => {
  const store = appStore()
  return { ...store, ...storeToRefs(store) }
}
