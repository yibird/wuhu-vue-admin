import topbar, { type TopbarConfigOptions } from 'topbar'
import { appStore } from '@/store'
import type { RouterPlugin } from './types'

const defaultOptions: TopbarConfigOptions = {
  barThickness: 2,
  barColors: {
    '0.2': 'rgba(24, 144, 255, .75)',
    '0.6': 'rgba(24, 144, 255, .85)',
    '1.0': 'rgba(24, 144, 255, 1)',
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

  return {
    name: 'progress-bar',
    hooks: {
      onBeforeEach() {
        const store = appStore()
        const enableProgressBar = store.animation.enableProgressBar
        if (!enableProgressBar) return
        const themeColor = store.app.themeColor
        watch(
          () => themeColor,
          () => {
            topbar.config({
              ...mergedOptions,
              barColors: themeColor
                ? {
                    '0.2': `rgba(${themeColor}, .75)`,
                    '0.6': `rgba(${themeColor}, .85)`,
                    '1.0': `rgba(${themeColor}, 1)`,
                  }
                : mergedOptions.barColors,
            })
          },
          { immediate: true }
        )
        topbar.show()
      },
      onAfterEach() {
        topbar.hide()
      },
    },
  }
}

export const progressBarPlugin = createProgressBarPlugin()
