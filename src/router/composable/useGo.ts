import { router } from '..'
import type { RouteLocationRaw, Router } from 'vue-router'

export function useGo(instance: Router = router) {
  function to(path: RouteLocationRaw, replace?: boolean) {
    if (replace) {
      instance.replace(path)
      return
    }
    instance.push(path)
  }
  const back = () => {
    instance.back()
  }
  const go = (delta: number) => {
    instance.go(delta)
  }
  return { to, back, go }
}
