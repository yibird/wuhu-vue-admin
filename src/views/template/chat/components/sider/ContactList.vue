<template>
  <div class="h-full flex flex-col">
    <Search
      v-model="keyword"
      placeholder="搜索联系人…"
      @create-group="emit('createGroup')"
      @add-contact="emit('addContact')"
      @open-global-search="emit('openGlobalSearch')"
    />
    <Tabs v-model:active-key="activeKey" :items="tabItems" />

    <VirtualList
      class="flex-1"
      aria-label="联系人列表"
      :items="contactRows"
      :estimate-size="estimateContactRowSize"
      :get-item-key="(row) => row.key"
    >
      <template #default="{ item: row }">
        <div v-if="row.type === 'header'" class="px-10 pb-4 pt-8">
          <div
            class="border-b-1 border-b-solid border-color-1 px-2 py-5 text-xs text-secondary font-600"
          >
            {{ row.letter }}
          </div>
        </div>

        <div v-else class="px-8 py-3">
          <div
            class="group relative rounded-6 transition-[background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(translate-x-1 bg-hover shadow-all-sm) active:scale-99 motion-reduce:(transform-none transition-none)"
          >
            <button
              type="button"
              class="block w-full border-0 bg-transparent p-10 pr-72 text-left cursor-pointer focus-visible:(outline-none bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)])"
              :aria-label="`查看${row.contact.name}资料`"
              @click="handleSelect(row.contact)"
            >
              <span class="flex items-center gap-10">
                <span class="relative shrink-0">
                  <a-avatar
                    :src="row.contact.avatar"
                    :size="44"
                    round
                    fallback-src="https://i.pravatar.cc/100?img=1"
                    class="transition-transform duration-motion-base ease-motion-enter group-hover:scale-105 motion-reduce:transform-none"
                  />
                  <span
                    v-if="row.contact.status"
                    class="absolute bottom-0 right-0 size-10 rounded-full border-2 border-container"
                    :class="{
                      'bg-success': row.contact.status === 'online',
                      'bg-fill': row.contact.status === 'offline',
                      'bg-error': row.contact.status === 'busy',
                      'bg-warning': row.contact.status === 'away',
                    }"
                  />
                </span>

                <span class="min-w-0 flex-1">
                  <span class="block truncate text-main font-500">
                    {{ row.contact.name }}
                  </span>
                  <span class="mt-2 block text-sm text-secondary">
                    {{ statusText(row.contact.status) }}
                  </span>
                </span>
              </span>

              <span
                v-if="row.contact.remark"
                class="mt-6 block truncate text-sm text-secondary"
              >
                备注: {{ row.contact.remark }}
              </span>

              <span
                v-if="row.contact.tags?.length"
                class="mt-6 flex flex-wrap gap-5"
              >
                <span
                  v-for="tag in row.contact.tags"
                  :key="tag"
                  class="rounded-4 bg-fill-quaternary px-6 py-2 text-xs text-secondary"
                >
                  {{ tag }}
                </span>
              </span>
            </button>

            <div
              class="absolute right-8 top-16 flex items-center opacity-75 transition-[opacity,transform] duration-motion-base ease-motion-enter group-focus-within:(translate-x-0 opacity-100) group-hover:(translate-x-0 opacity-100)"
            >
              <button
                type="button"
                class="button size-30 rounded-4 text-secondary hover:(bg-hover text-primary)"
                title="发起私聊"
                :aria-label="`与${row.contact.name}发起私聊`"
                @click.stop="startChat(row.contact)"
              >
                <Icon name="i-lucide:message-circle" :size="18" />
              </button>
              <a-dropdown
                :trigger="['click']"
                :menu="getActionMenu(row.contact)"
              >
                <button
                  type="button"
                  class="button size-30 rounded-4 text-secondary transition-colors hover:(bg-hover text-primary)"
                  title="更多"
                  :aria-label="`打开${row.contact.name}更多操作`"
                  @click.stop
                >
                  <Icon name="i-lucide:more-vertical" :size="18" />
                </button>
              </a-dropdown>
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="h-full flex items-center justify-center">
          <div class="text-center text-regular">
            <Icon name="i-lucide:user-x" :size="40" class="mb-10 opacity-50" />
            <div>暂无联系人</div>
          </div>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { MenuProps } from 'antdv-next'
import { Icon } from '@/components/icon'
import VirtualList from '../VirtualList.vue'
import Search from '../Search.vue'
import Tabs from '../Tabs.vue'
import type { Contact } from '../types'
import { statusText } from '../../utils'

interface Props {
  contacts?: Contact[]
}

type ContactRow =
  | { key: string; type: 'header'; letter: string }
  | { key: string; type: 'contact'; contact: Contact }

const props = withDefaults(defineProps<Props>(), {
  contacts: () => [],
})

const emit = defineEmits<{
  select: [contact: Contact]
  chat: [contact: Contact]
  createGroup: []
  addContact: []
  openGlobalSearch: []
}>()
const activeKey = shallowRef('all')
const keyword = shallowRef('')
const tabItems = [
  { key: 'all', label: '全部' },
  { key: 'online', label: '在线' },
  { key: 'busy', label: '忙碌' },
]

const filteredContacts = computed(() => {
  let list = props.contacts
  if (activeKey.value !== 'all') {
    list = list.filter((c) => c.status === activeKey.value)
  }

  const normalizedKeyword = keyword.value.trim().toLowerCase()
  if (!normalizedKeyword) return list

  return list.filter(
    (contact) =>
      contact.name.toLowerCase().includes(normalizedKeyword) ||
      getContactLetter(contact.name)
        .toLowerCase()
        .includes(normalizedKeyword) ||
      contact.remark?.toLowerCase().includes(normalizedKeyword) ||
      contact.tags?.some((tag) => tag.toLowerCase().includes(normalizedKeyword))
  )
})

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

const groupedContacts = computed(() => {
  const groups = new Map<string, Contact[]>()

  for (const contact of filteredContacts.value) {
    const letter = getContactLetter(contact.name)
    const list = groups.get(letter) ?? []
    list.push(contact)
    groups.set(letter, list)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => sortContactLetter(a, b))
    .map(([letter, contacts]) => ({
      letter,
      contacts: contacts.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
    }))
})

const contactRows = computed<ContactRow[]>(() =>
  groupedContacts.value.flatMap((group) => [
    { key: `header:${group.letter}`, type: 'header', letter: group.letter },
    ...group.contacts.map((contact) => ({
      key: `contact:${contact.id}`,
      type: 'contact' as const,
      contact,
    })),
  ])
)

function estimateContactRowSize(row: ContactRow) {
  return row.type === 'header' ? 38 : 112
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

function handleSelect(contact: Contact) {
  emit('select', contact)
}

function startChat(contact: Contact) {
  emit('chat', contact)
}

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 15 })
}

function getActionMenu(contact: Contact) {
  const items: MenuProps['items'] = [
    {
      key: 'detail',
      label: '查看资料',
      icon: renderMenuIcon('i-lucide:user-round'),
    },
    {
      key: 'chat',
      label: '发起私聊',
      icon: renderMenuIcon('i-lucide:message-circle'),
    },
  ]

  return {
    items,
    onClick: ({ key }: { key: string }) => handleAction(contact, key),
  }
}

function handleAction(contact: Contact, key: string) {
  if (key === 'detail') {
    handleSelect(contact)
    return
  }
  if (key === 'chat') startChat(contact)
}
</script>
