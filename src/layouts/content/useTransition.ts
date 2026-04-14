import { appStore } from '@/store'

export function useTransition() {
  const store = appStore()
  const transitionName = computed(() => store.animation.pageAnimation)
  return { transitionName }
}
