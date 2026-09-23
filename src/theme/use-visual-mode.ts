import { useAppStore } from '@/store'

export function useVisualMode() {
  const { app } = useAppStore()
  watch(
    () => [app.value.colourWeakness, app.value.greyMode],
    ([colourWeakness, greyMode]) => {
      const root = document.documentElement
      root.classList.toggle('w-color-weakness-mode', Boolean(colourWeakness))
      root.classList.toggle('w-grey-mode', Boolean(greyMode))
    },
    {
      immediate: true,
    }
  )
}
