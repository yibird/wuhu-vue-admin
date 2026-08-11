import { useAppStore } from '@/store'

export function useTransition() {
  const { animation } = useAppStore()
  const transitionName = computed(() => animation.value.pageAnimation)
  const loadingAnimation = computed(() => animation.value.loadingAnimation)
  return { transitionName, loadingAnimation }
}
