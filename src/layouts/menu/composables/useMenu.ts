import { createSharedComposable } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { useTabs } from '@/composables'
import { useAppStore } from '@/store'

const toMenuId = (id?: string) => id

export const useMenu = createSharedComposable(() => {
  const previewRootMenuId = shallowRef<string>()
  const { app } = useAppStore()
  const { currentTab } = useTabs()

  const routeRootMenuId = computed(() => toMenuId(currentTab.value?.rootId))
  const activeRootMenuId = computed(
    () => previewRootMenuId.value ?? routeRootMenuId.value
  )

  const setPreviewRootMenuId = (id?: string) => {
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
