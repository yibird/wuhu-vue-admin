import topbar, { type TopbarConfigOptions } from 'topbar'
import { watch, type WatchStopHandle } from 'vue'
import { useAppStore } from '@/store'
import type { RouterPlugin } from './types'

function getBarColors(themeColor: string) {
  return {
    '0.2': `rgb(${themeColor} / 75%)`,
    '0.6': `rgb(${themeColor} / 85%)`,
    '1.0': `rgb(${themeColor} / 100%)`,
  }
}

const defaultOptions: TopbarConfigOptions = {
  autoRun: false,
  barThickness: 2,
  shadowBlur: 0,
}

const setConfig = (options: TopbarConfigOptions, themeColor: string) => {
  topbar.config({
    ...options,
    barColors: getBarColors(themeColor),
  })
}

export function createProgressBarPlugin(
  options: TopbarConfigOptions = {}
): RouterPlugin {
  let watcher: WatchStopHandle | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }
  const watchThemeColor = () => {
    if (watcher) return
    const { app } = useAppStore()
    watcher = watch(
      () => app.value.themeColor,
      (val) => setConfig(mergedOptions, val),
      { immediate: true }
    )
  }

  return {
    name: 'progress-bar',
    hooks: {
      onBeforeEach() {
        if (hideTimer) {
          clearTimeout(hideTimer)
          hideTimer = undefined
        }
        const { animation } = useAppStore()
        if (!animation.value.enableProgressBar) return
        watchThemeColor()
        topbar.show()
        topbar.progress()
      },
      onAfterEach() {
        // 导航结束到新页面入场之间还有离场动画与骨架屏,
        // 延迟收起进度条,避免它比页面内容先消失、看起来像没生效
        if (hideTimer) clearTimeout(hideTimer)
        hideTimer = setTimeout(() => {
          hideTimer = undefined
          topbar.hide()
        }, 300)
      },
    },
    onDispose() {
      watcher?.()
      watcher = undefined
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = undefined
      }
    },
  }
}

export const progressBarPlugin = createProgressBarPlugin()
