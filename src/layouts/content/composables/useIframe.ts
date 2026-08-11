import { computed } from 'vue'
import { useTabStore } from '@/store'
import { isUrl } from '@/utils'

export function useIframe() {
  const { currentTab } = useTabStore()
  const isIframe = computed(() => {
    if (!currentTab.value) return false
    return currentTab.value.isExternal || isUrl(currentTab.value.path)
  })
  const iframeSrc = computed(() => {
    if (!isIframe.value) return ''
    return currentTab?.value?.path || ''
  })
  return {
    isIframe,
    iframeSrc,
  }
}
