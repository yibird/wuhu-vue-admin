import topbar, { type TopbarConfigOptions } from 'topbar'
import { watch, type WatchStopHandle } from 'vue'
import { useAppStore } from '@/store'
import type { RouterPlugin } from './types'

/** 导航开始后进度条停留的位置,避免停在 0 看不到进度 */
const PROGRESS_START = 0.3

/**
 * autoRun 关闭:topbar 的自动推进是常驻 rAF 循环,每帧都会重设 canvas 尺寸并重建渐变,
 * 正好和「拉取路由 chunk + 挂载页面」抢同一批帧,这里改为手动推进。
 */
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

export function createProgressBarPlugin(
  options: TopbarConfigOptions = {}
): RouterPlugin {
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
        // autoRun 关闭后需要手动推进一次,导航结束由 hide() 补到 100%
        topbar.progress(PROGRESS_START)
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
