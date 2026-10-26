import type { ScrollbarInstance } from '@/components/scrollbar'
import { useAppStore } from '@/store'

export function useLayout() {
  const scrollbarRef = useTemplateRef<ScrollbarInstance>('scrollbarRef')
  const { header, tabs } = useAppStore()

  const fixedHeader = computed(() => header.value.fixed)
  const showTabs = computed(() => tabs.value.show)

  const contentStyle = computed(() => {
    const minHeight = !fixedHeader.value
      ? '100%'
      : showTabs.value
        ? 'calc(100% - 90px)'
        : 'calc(100% - 50px)'
    return {
      'min-height': minHeight,
    }
  })
  const resetScroll = () => {
    scrollbarRef.value?.setScrollTop(0)
  }

  return {
    fixedHeader,
    showTabs,
    contentStyle,
    resetScroll,
  }
}
