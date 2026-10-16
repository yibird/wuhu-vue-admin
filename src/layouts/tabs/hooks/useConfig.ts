import { useAppStore } from '@/store'

export function useTabsConfig() {
  const { tabs } = useAppStore()
  const showIcon = computed(() => tabs.value.showIcon)
  const theme = computed(() => tabs.value.theme)
  return { showIcon, theme }
}
