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
export const SearchModal = defineAsyncComponent(
  () => import('./search-modal/index.vue')
)
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
