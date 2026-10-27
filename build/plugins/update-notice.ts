import { webUpdateNotice } from '@plugin-web-update-notification/vite'

export function updateNoticePlugin() {
  return webUpdateNotice({
    logVersion: true,
    locale: 'zh_CN',
    localeData: {
      en_US: {
        title: '📢 system update',
        description: 'System update, please refresh the page',
        buttonText: 'refresh',
        dismissButtonText: 'dismiss',
      },
      zh_CN: {
        title: '📢 系统更新',
        description: '系统已更新,请刷新页面',
        buttonText: '刷新',
        dismissButtonText: '忽略',
      },
    },
  })
}
