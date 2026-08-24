<template>
  <div class="h-full flex flex-col">
    <Search
      v-if="showToolbar"
      v-model="keyword"
      placeholder="搜索联系人…"
      @create-group="emit('createGroup')"
      @add-contact="emit('addContact')"
      @open-global-search="emit('openGlobalSearch')"
    />
    <Tabs
      v-if="showStatusFilter"
      v-model:active-key="activeKey"
      :items="tabItems"
    />

    <div class="min-h-0 flex-1 overflow-hidden">
      <Transition name="slide-left" mode="out-in">
        <VirtualList
          :key="activeKey"
          class="h-full"
          aria-label="联系人列表"
          :items="contactRows"
          :estimate-size="estimateContactRowSize"
          :get-item-key="(row) => row.key"
        >
          <template #default="{ item: row }">
            <div v-if="row.type === 'header'" class="px-10 py-4">
              <button
                v-if="row.collapsible"
                type="button"
                class="group h-38 w-full flex items-center gap-7 rounded-6 border-0 bg-transparent px-8 text-sm text-main font-600 cursor-pointer transition-[background-color,color] duration-motion-base hover:(bg-hover text-primary) focus-visible:(outline-none bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)])"
                :aria-expanded="!row.collapsed"
                :aria-label="`${row.collapsed ? '展开' : '收起'}${row.label}分组`"
                @click="toggleGroup(row.groupKey)"
              >
                <Icon
                  v-if="row.icon"
                  :name="row.icon"
                  :size="15"
                  class="shrink-0 text-primary transition-transform duration-motion-base ease-motion-enter group-hover:scale-110"
                />
                <span class="min-w-0 flex-1 truncate text-left">
                  {{ row.label }}
                </span>
                <span class="shrink-0 text-xs text-placeholder font-500">
                  {{ row.count }}
                </span>
                <Icon
                  name="i-lucide:chevron-down"
                  :size="15"
                  class="shrink-0 text-secondary transition-transform duration-motion-base ease-motion-enter"
                  :class="row.collapsed ? '-rotate-90' : 'rotate-0'"
                />
              </button>
              <div
                v-else
                class="h-38 flex items-center justify-between border-b-1 border-b-solid border-color-1 px-8 text-sm text-secondary font-600"
              >
                <span class="flex items-center gap-7">
                  <Icon
                    v-if="row.icon"
                    :name="row.icon"
                    :size="15"
                    class="text-primary"
                  />
                  {{ row.label }}
                </span>
                <span
                  v-if="groupMode === 'friendGroup'"
                  class="text-xs text-placeholder font-500"
                >
                  {{ row.count }}
                </span>
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
                <Icon
                  name="i-lucide:user-x"
                  :size="40"
                  class="mb-10 opacity-50"
                />
                <div>暂无联系人</div>
              </div>
            </div>
          </template>
        </VirtualList>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import VirtualList from '../VirtualList.vue'
import Search from '../Search.vue'
import Tabs from '../Tabs.vue'
import { useContactGroups } from '../../composables/useContactGroups'
import type { MenuProps } from 'antdv-next'
import type { Contact, FriendGroup } from '../types'
import type {
  ContactGroupMode,
  ContactRow,
} from '../../composables/useContactGroups'
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
const effectiveKeyword = computed(() => props.searchKeyword || keyword.value)
const { contactRows, toggleGroup } = useContactGroups({
  contacts: () => props.contacts,
  friendGroups: () => props.friendGroups,
  groupMode: () => props.groupMode,
  keyword: effectiveKeyword,
  activeStatus: activeKey,
  statusFilterEnabled: () => props.showStatusFilter,
})

function estimateContactRowSize(row: ContactRow) {
  return row.type === 'header' ? 46 : 112
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
