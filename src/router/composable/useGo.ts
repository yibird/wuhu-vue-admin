import { router } from '../setup'
import type { RouteLocationRaw, Router } from 'vue-router'

export function useGo(instance: Router = router) {
  function to(path: RouteLocationRaw, replace?: boolean) {
    return replace ? instance.replace(path) : instance.push(path)
  }

  async function toWithTransition(
    path: RouteLocationRaw,
    viewTransitionName: string,
    replace?: boolean
  ) {
    if (!document.startViewTransition) {
      return to(path, replace)
    }
    const element = document.querySelector(
      `[data-view-transition="${viewTransitionName}"]`
    )
    if (element instanceof HTMLElement) {
      element.style.viewTransitionName = viewTransitionName
    }
    await nextTick()
    return to(path, replace)
  }

  const back = () => {
    instance.back()
  }
  const go = (delta: number) => {
    instance.go(delta)
  }
  return { to, toWithTransition, back, go }
}
