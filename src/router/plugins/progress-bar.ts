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
        const { animation } = useAppStore()
        if (!animation.value.enableProgressBar) return
        watchThemeColor()
        topbar.show()
        topbar.progress()
      },
      onAfterEach() {
        topbar.hide()
      },
    },
    onDispose() {
      watcher?.()
      watcher = undefined
    },
  }
}

export const progressBarPlugin = createProgressBarPlugin()
