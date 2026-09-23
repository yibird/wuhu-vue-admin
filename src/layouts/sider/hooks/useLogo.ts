import { useAppStore } from '@/store'

export const useLogo = () => {
  const { app, sider } = useAppStore()
  const showLogo = computed(() => sider.value.showLogo)
  const logo = computed(() => app.value.logo)
  const name = computed(() => app.value.name)
  return { showLogo, logo, name }
}
