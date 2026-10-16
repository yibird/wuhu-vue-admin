import { createSharedComposable } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { useTabs } from '@/hooks'
import { permissionStore, useAppStore } from '@/store'
import type { IMenu } from '#/config'

export const useMenu = createSharedComposable(() => {
  const previewRootMenuId = shallowRef<string>()
  const { app } = useAppStore()
  const { currentTab } = useTabs()

  const routeRootMenuId = computed(() => currentTab.value?.rootId)
  const activeRootMenuId = computed(
    () => previewRootMenuId.value ?? routeRootMenuId.value
  )

  /**
   * 当前根菜单的子项,供 Mix / Split 侧边栏复用
   * 根菜单可能尚未注册(如 tabs 已持久化但菜单仍在异步加载),此时回退为空数组
   */
  const activeRootMenuChildren = computed<IMenu[]>(() => {
    const id = activeRootMenuId.value
    if (!id) return []
    const { menuCache } = permissionStore()
    return Reflect.get(menuCache.idMap, id)?.children ?? []
  })

  const setPreviewRootMenuId = (id?: string) => {
    previewRootMenuId.value = id
  }

  const clearPreviewRootMenuId = () => {
    previewRootMenuId.value = undefined
  }

  watch(
    [() => currentTab.value?.menuId, () => app.value.menuMode],
    clearPreviewRootMenuId
  )

  return {
    routeRootMenuId,
    previewRootMenuId,
    activeRootMenuId,
    activeRootMenuChildren,
    setPreviewRootMenuId,
    clearPreviewRootMenuId,
  }
})
