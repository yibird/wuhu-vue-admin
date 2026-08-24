import { computed, shallowRef, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { Contact, FriendGroup } from '../components/types'

export type ContactGroupMode = 'alphabet' | 'friendGroup'

export type ContactRow =
  | {
      key: string
      type: 'header'
      groupKey: string
      label: string
      count: number
      icon?: string
      collapsed: boolean
      collapsible: boolean
    }
  | { key: string; type: 'contact'; contact: Contact }

interface ContactGroupView {
  key: string
  label: string
  icon?: string
  contacts: Contact[]
}

interface UseContactGroupsOptions {
  contacts: MaybeRefOrGetter<readonly Contact[]>
  friendGroups: MaybeRefOrGetter<readonly FriendGroup[]>
  groupMode: MaybeRefOrGetter<ContactGroupMode>
  keyword: MaybeRefOrGetter<string>
  activeStatus: MaybeRefOrGetter<string>
  statusFilterEnabled: MaybeRefOrGetter<boolean>
}

const commonSurnameInitials: Record<string, string> = {
  张: 'Z',
  李: 'L',
  王: 'W',
  赵: 'Z',
  陈: 'C',
  刘: 'L',
  杨: 'Y',
  黄: 'H',
  周: 'Z',
  吴: 'W',
  徐: 'X',
  孙: 'S',
  胡: 'H',
  朱: 'Z',
  高: 'G',
  林: 'L',
  何: 'H',
  郭: 'G',
  马: 'M',
  罗: 'L',
  梁: 'L',
  宋: 'S',
  郑: 'Z',
  谢: 'X',
  韩: 'H',
  唐: 'T',
  冯: 'F',
  于: 'Y',
  董: 'D',
  萧: 'X',
  程: 'C',
  曹: 'C',
  袁: 'Y',
  邓: 'D',
  许: 'X',
  傅: 'F',
  沈: 'S',
  曾: 'Z',
  彭: 'P',
  吕: 'L',
}

/**
 * 统一处理联系人过滤、分组和收缩状态。搜索期间临时展开匹配分组，
 * 搜索结束后恢复用户原有的收缩状态。
 */
export function useContactGroups(options: UseContactGroupsOptions) {
  const collapsedGroupKeys = shallowRef<ReadonlySet<string>>(new Set())

  const normalizedKeyword = computed(() =>
    toValue(options.keyword).trim().toLowerCase()
  )
  const filteredContacts = computed(() => {
    let contacts = [...toValue(options.contacts)]
    const activeStatus = toValue(options.activeStatus)

    if (toValue(options.statusFilterEnabled) && activeStatus !== 'all') {
      contacts = contacts.filter((contact) => contact.status === activeStatus)
    }

    if (!normalizedKeyword.value) return contacts
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalizedKeyword.value) ||
        getContactLetter(contact.name)
          .toLowerCase()
          .includes(normalizedKeyword.value) ||
        contact.remark?.toLowerCase().includes(normalizedKeyword.value) ||
        contact.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedKeyword.value)
        )
    )
  })

  const groupedContacts = computed<ContactGroupView[]>(() => {
    if (toValue(options.groupMode) === 'friendGroup') {
      return groupContactsByFriendGroup(
        filteredContacts.value,
        toValue(options.friendGroups)
      )
    }
    return groupContactsByLetter(filteredContacts.value)
  })

  const contactRows = computed<ContactRow[]>(() => {
    const canCollapse =
      toValue(options.groupMode) === 'friendGroup' && !normalizedKeyword.value

    return groupedContacts.value.flatMap((group) => {
      const collapsed = canCollapse && collapsedGroupKeys.value.has(group.key)
      const header: ContactRow = {
        key: `header:${group.key}`,
        type: 'header',
        groupKey: group.key,
        label: group.label,
        count: group.contacts.length,
        icon: group.icon,
        collapsed,
        collapsible: canCollapse,
      }

      if (collapsed) return [header]
      return [
        header,
        ...group.contacts.map((contact) => ({
          key: `contact:${contact.id}`,
          type: 'contact' as const,
          contact,
        })),
      ]
    })
  })

  function toggleGroup(groupKey: string) {
    if (toValue(options.groupMode) !== 'friendGroup') return

    const nextKeys = new Set(collapsedGroupKeys.value)
    if (nextKeys.has(groupKey)) nextKeys.delete(groupKey)
    else nextKeys.add(groupKey)
    collapsedGroupKeys.value = nextKeys
  }

  return {
    contactRows,
    toggleGroup,
  }
}

function groupContactsByLetter(contacts: Contact[]): ContactGroupView[] {
  const groups = new Map<string, Contact[]>()

  for (const contact of contacts) {
    const letter = getContactLetter(contact.name)
    const list = groups.get(letter) ?? []
    list.push(contact)
    groups.set(letter, list)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => sortContactLetter(a, b))
    .map(([letter, groupContacts]) => ({
      key: letter,
      label: letter,
      contacts: groupContacts.sort((a, b) =>
        a.name.localeCompare(b.name, 'zh-CN')
      ),
    }))
}

function groupContactsByFriendGroup(
  contacts: Contact[],
  friendGroups: readonly FriendGroup[]
): ContactGroupView[] {
  const configuredGroups = [...friendGroups].sort((a, b) => a.order - b.order)
  const configuredGroupIds = new Set(configuredGroups.map((group) => group.id))
  const result = configuredGroups
    .map((group) => ({
      key: group.id,
      label: group.name,
      icon: group.icon,
      contacts: contacts
        .filter((contact) => contact.friendGroupId === group.id)
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
    }))
    .filter((group) => group.contacts.length > 0)
  const ungroupedContacts = contacts
    .filter(
      (contact) =>
        !contact.friendGroupId || !configuredGroupIds.has(contact.friendGroupId)
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  if (ungroupedContacts.length) {
    result.push({
      key: 'other',
      label: '其他好友',
      icon: 'i-lucide:users-round',
      contacts: ungroupedContacts,
    })
  }

  return result
}

function getContactLetter(name: string) {
  const firstChar = name.trim().charAt(0)
  if (!firstChar) return '#'

  const upper = firstChar.toUpperCase()
  if (/^[A-Z]$/.test(upper)) return upper
  return commonSurnameInitials[firstChar] ?? '#'
}

function sortContactLetter(a: string, b: string) {
  if (a === b) return 0
  if (a === '#') return 1
  if (b === '#') return -1
  return a.localeCompare(b, 'en-US')
}
