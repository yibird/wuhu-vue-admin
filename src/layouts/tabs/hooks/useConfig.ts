import { useAppStore } from '@/store'

export function useConfig() {
  const { tabs } = useAppStore()
  const showIcon = computed(() => tabs.value.showIcon)
  const theme = computed(() => tabs.value.theme)
  return { showIcon, theme }
}
