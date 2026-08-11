import { tryOnScopeDispose } from '@vueuse/core'
import { watch, type WatchStopHandle } from 'vue'
import { isNavigationFailure } from 'vue-router'
import { prefetchMenuRoute, router } from '@/router'
import { navigateTabRoute } from '@/router/utils/tabNavigation'
import { tabStore } from '@/store'
import { isUrl } from '@/utils'

export function useTabNav() {
  const store = tabStore()
  let navigationToken = 0
  let cancelScheduledPrefetch: (() => void) | undefined

  const scheduleOpenTabPrefetch = (activePath: string) => {
    cancelScheduledPrefetch?.()
    const candidates = [store.homeTab, ...store.tabs]
      .filter(
        (tab) =>
          tab?.path &&
          tab.path !== activePath &&
          !isUrl(tab.path) &&
          !tab.disabled
      )
      .slice(0, 2)

    if (!candidates.length || typeof window === 'undefined') return

    const prefetch = () => {
      candidates.forEach((tab) => void prefetchMenuRoute(tab!))
    }

    const idleWindow = window as unknown as {
      cancelIdleCallback?: (id: number) => void
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number }
      ) => number
    }
    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(prefetch, { timeout: 1500 })
      cancelScheduledPrefetch = () => idleWindow.cancelIdleCallback?.(idleId)
      return
    }

    const timeoutId = setTimeout(prefetch, 300)
    cancelScheduledPrefetch = () => clearTimeout(timeoutId)
  }

  const navigate = async (targetPath: string) => {
    const token = ++navigationToken
    try {
      const failure = await navigateTabRoute(router, targetPath)
      if (token !== navigationToken) return
      if (!failure) scheduleOpenTabPrefetch(targetPath)
      if (failure && !isNavigationFailure(failure)) {
        console.warn('[TabNav] Navigation failed:', failure)
      }
    } catch (error) {
      if (token === navigationToken) {
        console.warn('[TabNav] Navigation failed:', error)
      }
    }
  }

  const stop: WatchStopHandle = watch(
    () => store.currentTab?.path,
    (targetPath) => {
      if (!targetPath || targetPath === router.currentRoute.value.path) return
      if (isUrl(targetPath)) return
      navigationToken++
      navigate(targetPath)
    },
    { immediate: true }
  )

  tryOnScopeDispose(() => {
    stop()
    cancelScheduledPrefetch?.()
    navigationToken++
  })
}
