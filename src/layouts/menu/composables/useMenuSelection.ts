import { createSharedComposable } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { useTabs } from '@/composables'
import { useAppStore } from '@/store'

const toMenuId = (id?: number | string | null) =>
  id === undefined || id === null ? undefined : String(id)

export const useMenuSelection = createSharedComposable(() => {
  const previewRootMenuId = shallowRef<string>()
  const { app } = useAppStore()
  const { currentTab } = useTabs()

  const routeRootMenuId = computed(() => toMenuId(currentTab.value?.rootId))
  const activeRootMenuId = computed(
    () => previewRootMenuId.value ?? routeRootMenuId.value
  )

  const setPreviewRootMenuId = (id?: number | string | null) => {
    previewRootMenuId.value = toMenuId(id)
  }

  const clearPreviewRootMenuId = () => {
    previewRootMenuId.value = undefined
  }

  watch(
    [() => currentTab.value?.name, () => app.value.menuMode],
    clearPreviewRootMenuId
  )

  return {
    routeRootMenuId,
    previewRootMenuId,
    activeRootMenuId,
    setPreviewRootMenuId,
    clearPreviewRootMenuId,
  }
})
