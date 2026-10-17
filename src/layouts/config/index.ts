import { loadPinyinMatch } from '@/utils'
import LockScreenLoadingCover from './lock-screen/components/loading-cover.vue'

export const NoticeCenter = defineAsyncComponent(
  () => import('./notice-center/index.vue')
)
export const DownloadCenter = defineAsyncComponent(
  () => import('./download-center/index.vue')
)
export const NoteBookModal = defineAsyncComponent(
  () => import('./note-book-modal/index.vue')
)
export const ChatModal = defineAsyncComponent(
  () => import('./chat-modal/index.vue')
)
export const ChangePassword = defineAsyncComponent(
  () => import('./change-password/index.vue')
)
const loadSearchModal = () => import('./search-modal/index.vue')

export const SearchModal = defineAsyncComponent(loadSearchModal)

/**
 * 预热全局搜索面板
 *
 * 面板在首次打开时才挂载,等待 chunk 与拼音库下载会带来明显延迟;
 * 在空闲时提前加载,首次打开即可直接渲染。
 *
 * @returns 预加载 Promise,重复调用复用同一次请求
 */
let searchModalPreload: Promise<unknown> | undefined

export function preloadSearchModal() {
  searchModalPreload ??= Promise.all([
    loadSearchModal(),
    loadPinyinMatch(),
  ]).catch(() => undefined)

  return searchModalPreload
}
/**
 * 锁屏整体懒加载,避免进入首屏 chunk;
 * 但等待 chunk 期间必须立刻盖住桌面,所以配置 loadingComponent 作为即时遮罩
 */
export const LockScreenModal = defineAsyncComponent({
  loader: () => import('./lock-screen/index.vue'),
  loadingComponent: LockScreenLoadingCover,
  delay: 0,
})

export { useGlobalSearch, useLockScreen } from './hooks'
