<template>
  <div class="h-full flex flex-col">
    <Search
      v-if="showToolbar"
      v-model="keyword"
      placeholder="搜索联系人…"
      @create-group="emits('createGroup')"
      @add-contact="emits('addContact')"
      @open-global-search="emits('openGlobalSearch')"
    />
    <Tabs
      v-if="showStatusFilter"
      v-model:active-key="activeKey"
      :items="tabItems"
    />

    <div class="min-h-0 flex-1 overflow-hidden">
      <Scrollbar>
        <Transition name="slide-left" mode="out-in">
          <a-listy
            v-if="flatContacts.length"
            :key="activeKey"
            aria-label="联系人列表"
            role="list"
            sticky
            :items="flatContacts"
            :group="{ key: getContactGroupKey, title: renderGroupHeader }"
            :styles="{
              item: { padding: '0', borderBottom: 'none' },
              groupHeader: { padding: '0' },
            }"
            row-key="id"
          >
            <template #itemRender="contact">
              <div>
                <div
                  class="group relative rounded-6 transition-[background-color,box-shadow,transform] duration-200 ease-[var(--w-motion-ease-enter)] hover:(translate-x-1 bg-hover shadow-sm) active:scale-99 motion-reduce:(transform-none transition-none)"
                >
                  <button
                    type="button"
                    class="block-button p-10 pr-72 text-left motion-press focus-visible:(outline-none bg-hover ring-2 ring-primary/24)"
                    :aria-label="`查看${contact.name}资料`"
                    @click="handleSelect(contact)"
                  >
                    <span class="flex items-center gap-10">
                      <span class="relative shrink-0">
                        <a-avatar
                          :src="contact.avatar"
                          :size="44"
                          round
                          class="transition-transform duration-200 ease-[var(--w-motion-ease-enter)] group-hover:scale-105 motion-reduce:transform-none"
                        />
                        <span
                          v-if="contact.status"
                          class="absolute bottom-0 right-0 size-10 rounded-full b-2-[var(--w-bg-container)]"
                          :class="{
                            'bg-success': contact.status === 'online',
                            'bg-fill': contact.status === 'offline',
                            'bg-error': contact.status === 'busy',
                            'bg-warning': contact.status === 'away',
                          }"
                        />
                      </span>

                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-main font-500">
                          {{ contact.name }}
                        </span>
                        <span class="mt-2 block text-sm text-secondary">
                          {{ statusText(contact.status) }}
                        </span>
                      </span>
                    </span>

                    <span
                      v-if="contact.remark"
                      class="mt-6 block truncate text-sm text-secondary"
                    >
                      备注: {{ contact.remark }}
                    </span>

                    <span
                      v-if="contact.tags?.length"
                      class="mt-6 flex flex-wrap gap-5"
                    >
                      <span
                        v-for="tag in contact.tags"
                        :key="tag"
                        class="rounded-4 bg-secondary px-6 py-2 text-xs text-secondary"
                      >
                        {{ tag }}
                      </span>
                    </span>
                  </button>

                  <div
                    class="absolute right-8 top-16 flex items-center opacity-75 transition-[opacity,transform] duration-200 ease-[var(--w-motion-ease-enter)] group-focus-within:(translate-x-0 opacity-100) group-hover:(translate-x-0 opacity-100)"
                  >
                    <button
                      type="button"
                      class="button size-30 rounded-4 text-secondary hover:(bg-hover text-primary)"
                      title="发起私聊"
                      :aria-label="`与${contact.name}发起私聊`"
                      @click.stop="startChat(contact)"
                    >
                      <Icon name="i-lucide:message-circle" :size="18" />
                    </button>
                    <a-dropdown
                      :trigger="['click']"
                      :menu="getActionMenu(contact)"
                    >
                      <button
                        type="button"
                        class="button size-30 rounded-4 text-secondary transition-colors hover:(bg-hover text-primary)"
                        title="更多"
                        :aria-label="`打开${contact.name}更多操作`"
                        @click.stop
                      >
                        <Icon name="i-lucide:more-vertical" :size="18" />
                      </button>
                    </a-dropdown>
                  </div>
                </div>
              </div>
            </template>
          </a-listy>

          <div
            v-else
            :key="`empty-${activeKey}`"
            class="py-60 flex items-center justify-center"
          >
            <div class="text-center text-regular">
              <Icon
                name="i-lucide:user-x"
                :size="40"
                class="mb-10 opacity-50"
              />
              <div>暂无联系人</div>
            </div>
          </div>
        </Transition>
      </Scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Scrollbar } from '@/components/scrollbar'
import { Icon } from '@/components/icon'
import Search from './search.vue'
import Tabs from './tabs.vue'
import { useContactGroups, type ContactGroupMode } from './hooks'
import type { MenuProps } from 'antdv-next'
import type { Contact, FriendGroup } from '../types'
import { statusText } from '../../utils'

interface Props {
  contacts?: Contact[]
  friendGroups?: FriendGroup[]
  groupMode?: ContactGroupMode
  searchKeyword?: string
  showToolbar?: boolean
  showStatusFilter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  contacts: () => [],
  friendGroups: () => [],
  groupMode: 'alphabet',
  searchKeyword: '',
  showToolbar: true,
  showStatusFilter: true,
})

const emits = defineEmits<{
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
const effectiveKeyword = computed(() => props.searchKeyword || keyword.value)
const { contactGroups, flatContacts, getContactGroupKey } = useContactGroups({
  contacts: () => props.contacts,
  friendGroups: () => props.friendGroups,
  groupMode: () => props.groupMode,
  keyword: effectiveKeyword,
  activeStatus: activeKey,
  statusFilterEnabled: () => props.showStatusFilter,
})

function renderGroupHeader(groupKey: string, items: Contact[]) {
  const group = contactGroups.value.find((item) => item.key === groupKey)

  return h(
    'div',
    {
      class:
        'h-38 flex items-center gap-7 b-b-1-muted px-8 text-sm text-main font-600',
    },
    [
      group?.icon
        ? h(Icon, {
            name: group.icon,
            size: 15,
            class: 'shrink-0 text-primary',
          })
        : null,
      h(
        'span',
        { class: 'min-w-0 flex-1 truncate text-left' },
        group?.label ?? String(groupKey)
      ),
      h(
        'span',
        { class: 'shrink-0 text-xs text-placeholder font-500' },
        String(items.length)
      ),
    ]
  )
}

function handleSelect(contact: Contact) {
  emits('select', contact)
}

function startChat(contact: Contact) {
  emits('chat', contact)
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
