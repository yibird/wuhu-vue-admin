import { computed } from 'vue'
import { isUrl } from '@/utils'
import { useTabs } from '@/hooks'

export function useIframe() {
  const { currentTab } = useTabs()
  const isIframe = computed(() => {
    const path = currentTab.value?.path
    return Boolean(path && isUrl(path))
  })
  const iframeSrc = computed(() => {
    if (!isIframe.value) return ''
    return currentTab.value?.path || ''
  })
  return {
    isIframe,
    iframeSrc,
  }
}
