import { useEventListener } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  Contact,
  Conversation,
  GroupPanelTab,
  NavType,
  UserInfo,
} from '../components/types'

interface UseChatPanelsOptions {
  activeKey: Ref<NavType>
  activeConversation: Readonly<Ref<Conversation | undefined>>
  contacts: Ref<Contact[]>
  conversations: Ref<Conversation[]>
  selectConversation: (conversation: Conversation) => void
  startContactChat: (contact: Contact, navigateToConversation?: boolean) => void
}

/**
 * 管理聊天页面的弹层状态和全局快捷键。
 * 全局监听由 VueUse 随当前 effect scope 自动释放，页面卸载后不会残留键盘事件。
 */
export function useChatPanels(options: UseChatPanelsOptions) {
  const selectedUser = shallowRef<UserInfo | null>(null)
  const settingsModalOpen = shallowRef(false)
  const createGroupModalOpen = shallowRef(false)
  const addContactModalOpen = shallowRef(false)
  const globalSearchOpen = shallowRef(false)
  const groupDrawerOpen = shallowRef(false)
  const groupPanelTab = shallowRef<GroupPanelTab>('announcement')
  const userDetailOpen = computed(() => Boolean(selectedUser.value))

  function openSettingsModal() {
    settingsModalOpen.value = true
  }

  function openCreateGroupModal() {
    createGroupModalOpen.value = true
  }

  function openAddContactModal() {
    addContactModalOpen.value = true
  }

  function openGlobalSearch() {
    globalSearchOpen.value = true
  }

  function openGroupPanel(tab: GroupPanelTab) {
    if (options.activeConversation.value?.type !== 'group') return
    groupPanelTab.value = tab
    groupDrawerOpen.value = true
  }

  function handleGlobalContactSelect(contact: Contact) {
    options.startContactChat(contact)
  }

  function handleGlobalGroupSelect(group: Conversation) {
    options.activeKey.value = 'conversation'
    options.selectConversation(group)
  }

  function openUserDetail(user: UserInfo) {
    const contact = options.contacts.value.find((item) => item.id === user.id)
    const conversationUser = options.conversations.value.find(
      (item) => item.userInfo?.id === user.id
    )?.userInfo

    selectedUser.value = {
      ...conversationUser,
      ...contact,
      ...user,
    }
  }

  function closeUserDetail() {
    selectedUser.value = null
  }

  function handleContactQuickChat(contact: Contact) {
    options.startContactChat(contact, false)
  }

  function startPrivateChat(user: UserInfo) {
    const navigateToConversation = options.activeKey.value !== 'contact'
    closeUserDetail()
    groupDrawerOpen.value = false
    options.startContactChat(user, navigateToConversation)
  }

  function handleGlobalSearchShortcut(event: KeyboardEvent) {
    if (event.defaultPrevented) return
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') {
      return
    }

    event.preventDefault()
    openGlobalSearch()
  }

  watch(
    () => options.activeConversation.value?.id,
    () => {
      if (options.activeConversation.value?.type !== 'group') {
        groupDrawerOpen.value = false
      }
    }
  )
  useEventListener(window, 'keydown', handleGlobalSearchShortcut, {
    capture: true,
  })

  return {
    addContactModalOpen,
    createGroupModalOpen,
    globalSearchOpen,
    groupDrawerOpen,
    groupPanelTab,
    selectedUser,
    settingsModalOpen,
    userDetailOpen,
    closeUserDetail,
    handleContactQuickChat,
    handleGlobalContactSelect,
    handleGlobalGroupSelect,
    openAddContactModal,
    openCreateGroupModal,
    openGlobalSearch,
    openGroupPanel,
    openSettingsModal,
    openUserDetail,
    startPrivateChat,
  }
}
