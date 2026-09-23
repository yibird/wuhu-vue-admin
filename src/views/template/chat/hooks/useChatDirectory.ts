import { ref, type Ref } from 'vue'
import { message } from 'antdv-next'
import {
  createDirectoryCandidates,
  createFriendGroups,
  createGroupMembers,
  createInitialContacts,
} from '../data'
import type {
  Contact,
  Conversation,
  CreateGroupPayload,
  DirectoryGroupItem,
  DirectoryUserItem,
} from '../components/types'

interface UseChatDirectoryOptions {
  conversations: Ref<Conversation[]>
}

/** 管理好友、群聊和企业通讯录数据，不负责页面导航和消息状态。 */
export function useChatDirectory(options: UseChatDirectoryOptions) {
  const contacts = ref<Contact[]>(createInitialContacts())
  const friendGroups = createFriendGroups()
  const directoryCandidates = createDirectoryCandidates()
  function updateGroupAnnouncement(
    conversation: Conversation,
    content: string
  ) {
    if (conversation.type !== 'group' || !conversation.groupInfo) return

    conversation.groupInfo.announcement = {
      content,
      updatedAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      updatedBy: '我',
    }
    message.success('群公告已更新')
  }

  function createGroup(payload: CreateGroupPayload) {
    const id = `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const selectedContacts = contacts.value.filter((contact) =>
      payload.memberIds.includes(contact.id)
    )
    const members = createGroupMembers(
      id,
      payload.memberIds.length + 1,
      selectedContacts
    )
    const group: Conversation = {
      id,
      type: 'group',
      title: payload.name,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(payload.name)}`,
      lastMessage: `${payload.memberIds.length + 1} 位成员已加入群聊`,
      lastMessageTime: '刚刚',
      unreadCount: 0,
      groupInfo: {
        id,
        name: payload.name,
        memberCount: members.length,
        category: payload.category,
        memberIds: members.map((member) => member.id),
        members,
      },
    }

    options.conversations.value.unshift(group)
    message.success(`群聊「${payload.name}」创建成功`)
    return group
  }

  function addDirectoryUser(user: DirectoryUserItem) {
    if (contacts.value.some((contact) => contact.id === user.id)) {
      message.info('该用户已经是你的好友')
      return false
    }

    contacts.value.unshift({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      status: user.status ?? 'offline',
      title: user.title,
      department: user.department,
      tags: user.tags,
      remark: '通过通讯录搜索添加',
      friendGroupId: 'new',
    })
    message.success(`已添加 ${user.name} 为好友`)
    return true
  }

  function addDirectoryGroup(item: DirectoryGroupItem) {
    if (
      options.conversations.value.some(
        (conversation) =>
          conversation.type === 'group' && conversation.id === item.id
      )
    ) {
      message.info('你已经加入该群聊')
      return
    }

    const members = createGroupMembers(
      item.id,
      item.memberCount + 1,
      contacts.value
    )
    const group: Conversation = {
      id: item.id,
      type: 'group',
      title: item.name,
      avatar: item.avatar,
      lastMessage: item.description || '已加入群聊',
      lastMessageTime: '刚刚',
      unreadCount: 0,
      groupInfo: {
        id: item.id,
        name: item.name,
        memberCount: members.length,
        category: item.category,
        memberIds: members.map((member) => member.id),
        members,
        announcement: item.description
          ? {
              content: item.description,
              updatedAt: '刚刚',
              updatedBy: '群管理员',
            }
          : undefined,
      },
    }

    options.conversations.value.unshift(group)
    message.success(`已加入群聊「${item.name}」`)
    return group
  }

  return {
    contacts,
    directoryCandidates,
    friendGroups,
    addDirectoryGroup,
    addDirectoryUser,
    createGroup,
    updateGroupAnnouncement,
  }
}
