import { useAppStore } from '@/store'

export function useTransition() {
  const { animation } = useAppStore()

  const pageAnimation = computed(() => animation.value.pageAnimation)
  const pageAnimationMode = computed(() => animation.value.pageAnimationMode)

  return {
    pageAnimation,
    pageAnimationMode,
  }
}
