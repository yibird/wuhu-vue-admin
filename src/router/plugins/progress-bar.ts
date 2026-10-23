import topbar, { type TopbarConfigOptions } from 'topbar'
import { watch, type WatchStopHandle } from 'vue'
import { useAppStore } from '@/store'
import type { RouterPlugin } from './types'

const defaultOptions: TopbarConfigOptions = {
  autoRun: false,
  barThickness: 2,
  barColors: {
    '0.2': 'rgb(var(--w-color-primary) / 75%)',
    '0.6': 'rgb(var(--w-color-primary) / 85%)',
    '1.0': 'rgb(var(--w-color-primary))',
  },
  shadowBlur: 0,
}
const createBarColors = (options: TopbarConfigOptions, themeColor?: string) => {
  const color = themeColor?.trim()
  if (!color) return options.barColors
  return {
    '0.2': `rgba(${color}, .75)`,
    '0.6': `rgba(${color}, .85)`,
    '1.0': `rgba(${color}, 1)`,
  }
}

const setConfig = (options: TopbarConfigOptions, themeColor: string) => {
  topbar.config({
    ...options,
    barColors: createBarColors(options, themeColor),
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
