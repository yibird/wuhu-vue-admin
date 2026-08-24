import { tryOnScopeDispose } from '@vueuse/core'
import { watch, type WatchStopHandle } from 'vue'
import { isNavigationFailure } from 'vue-router'
import { router } from '@/router'
import { pushRoute } from '@/router/utils/pushRoute'
import { tabStore } from '@/store'
import { isUrl } from '@/utils'

export function useTabNav() {
  const store = tabStore()
  let navigationToken = 0

  const navigate = async (targetPath: string) => {
    const token = ++navigationToken
    try {
      const failure = await pushRoute(router, targetPath)
      if (token !== navigationToken) return
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
    navigationToken++
  })
}
