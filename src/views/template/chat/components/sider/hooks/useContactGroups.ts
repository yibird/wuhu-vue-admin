import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { commonSurnameInitials } from '../data'
import type { Contact, FriendGroup } from '../../types'

export type ContactGroupMode = 'alphabet' | 'friendGroup'

export interface ContactGroupView {
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

/**
 * 统一处理联系人过滤与分组，输出扁平列表和分组键，
 * 供 Listy 的分组渲染能力直接使用。
 */
export function useContactGroups(options: UseContactGroupsOptions) {
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

  const contactGroups = computed<ContactGroupView[]>(() => {
    if (toValue(options.groupMode) === 'friendGroup') {
      return groupContactsByFriendGroup(
        filteredContacts.value,
        toValue(options.friendGroups)
      )
    }
    return groupContactsByLetter(filteredContacts.value)
  })

  const flatContacts = computed(() =>
    contactGroups.value.flatMap((group) => group.contacts)
  )

  const contactGroupKeyMap = computed(
    () =>
      new Map(
        contactGroups.value.flatMap((group) =>
          group.contacts.map((contact) => [contact.id, group.key] as const)
        )
      )
  )

  function getContactGroupKey(contact: Contact) {
    return contactGroupKeyMap.value.get(contact.id) ?? 'other'
  }

  return {
    contactGroups,
    flatContacts,
    getContactGroupKey,
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
