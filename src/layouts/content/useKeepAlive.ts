import { useRouter } from 'vue-router'
import { intersectionWith } from 'es-toolkit'
import { tabsStore } from '@/store'

import type { IRoute } from '@/router/types'

export function useKeepAlive() {
  const router = useRouter()
  const store = tabsStore()

  const cachedTabs = computed(() => store.getCachedTabs)
  const routes = computed(
    () => router.getRoutes().filter((item) => item.meta) as IRoute[]
  )

  const include = computed(() => {
    return intersectionWith(routes.value, cachedTabs.value, (item1, item2) => {
      return String(item1.meta?.id) === String(item2)
    })
      .filter((item) => item.meta?.componentName)
      .map((item) => item.meta!.componentName) as string[]
  })

  watch(store.tabs, () => {
    store.updateCachedTabs()
  })
  return { include }
}
