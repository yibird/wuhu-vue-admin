import topbar, { type TopbarConfigOptions } from 'topbar'
import { useAppStore } from '@/store'
import type { RouterPlugin } from './types'
import type { WatchStopHandle } from 'vue'

const defaultOptions: TopbarConfigOptions = {
  barThickness: 2,
  barColors: {
    '0.2': 'rgb(var(--w-color-primary) / 75%)',
    '0.6': 'rgb(var(--w-color-primary) / 85%)',
    '1.0': 'rgb(var(--w-color-primary))',
  },
  shadowBlur: 0,
}

export function createProgressBarPlugin(
  options: TopbarConfigOptions = {}
): RouterPlugin {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  let stopThemeColorWatcher: WatchStopHandle | undefined

  const createBarColors = (themeColor?: string) => {
    const color = themeColor?.trim()
    if (!color) return mergedOptions.barColors

    return {
      '0.2': `rgba(${color}, .75)`,
      '0.6': `rgba(${color}, .85)`,
      '1.0': `rgba(${color}, 1)`,
    }
  }

  const applyTopbarConfig = (themeColor?: string) => {
    topbar.config({
      ...mergedOptions,
      barColors: createBarColors(themeColor),
    })
  }

  const ensureThemeColorWatcher = () => {
    if (stopThemeColorWatcher) return

    const { app } = useAppStore()
    stopThemeColorWatcher = watch(
      () => app.value.themeColor,
      applyTopbarConfig,
      { immediate: true }
    )
  }

  return {
    name: 'progress-bar',
    hooks: {
      onBeforeEach() {
        const { animation } = useAppStore()
        const enableProgressBar = animation.value.enableProgressBar
        if (!enableProgressBar) return
        ensureThemeColorWatcher()
        topbar.show()
      },
      onAfterEach() {
        topbar.hide()
      },
    },
    onDispose() {
      stopThemeColorWatcher?.()
      stopThemeColorWatcher = undefined
    },
  }
}

export const progressBarPlugin = createProgressBarPlugin()
