import { useAppStore } from '@/store'
import { computedPick } from '@/utils'

export function useTransition() {
  const { animation } = useAppStore()
  return computedPick(animation, [
    'pageAnimation',
    'pageAnimationMode',
    'loadingAnimation',
  ] as const)
}
