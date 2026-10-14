import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isUrl } from '@/utils'

/**
 * 判断当前是否为外链菜单的 iframe 页
 *
 * 只以路由为准:tabs store 的 currentTab 由 activeKey 推导,而 activeKey 并不总跟随路由
 * (页面内直接 router.push、路由没有对应 Tab 时都会停在旧 Tab),一旦取到过期的外链 Tab,
 * iframe 分支就会一直占住内容区,新页面永远不渲染。
 *
 * 外链菜单不是路由,点击后地址栏会变成 `/https://example.com` 这样的地址,
 * 因此去掉首个 `/` 后判断是否为 URL 即可,同时保留 query 与 hash。
 */
export function useIframe() {
  const route = useRoute()
  const iframeSrc = computed(() => {
    const src = route.fullPath.slice(1)
    return isUrl(src) ? src : ''
  })
  const isIframe = computed(() => Boolean(iframeSrc.value))

  return {
    isIframe,
    iframeSrc,
  }
}
