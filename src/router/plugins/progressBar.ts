import topbar, { type TopbarConfigOptions } from 'topbar'
import { watch, type WatchStopHandle } from 'vue'
import { useAppStore } from '@/store'

const defaultOptions: TopbarConfigOptions = {
  barThickness: 2,
  barColors: {
    '0.2': 'rgb(var(--w-color-primary) / 75%)',
    '0.6': 'rgb(var(--w-color-primary) / 85%)',
    '1.0': 'rgb(var(--w-color-primary))',
  },
  shadowBlur: 0,
}

export function createProgressBarPlugin(options: TopbarConfigOptions = {}) {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  let watcher: WatchStopHandle | undefined
  const createBarColors = (themeColor?: string) => {
    const color = themeColor?.trim()
    if (!color) return mergedOptions.barColors
    return {
      '0.2': `rgba(${color}, .75)`,
      '0.6': `rgba(${color}, .85)`,
      '1.0': `rgba(${color}, 1)`,
    }
  }

  const setConfig = (themeColor?: string) => {
    topbar.config({
      ...mergedOptions,
      barColors: createBarColors(themeColor),
    })
  }

  const watchThemeColor = () => {
    if (watcher) return
    const { app } = useAppStore()
    watcher = watch(() => app.value.themeColor, setConfig, { immediate: true })
  }

  return {
    name: 'progress-bar',
    hooks: {
      onBeforeEach() {
        const { animation } = useAppStore()
        if (!animation.value.enableProgressBar) return
        watchThemeColor()
        topbar.show()
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
