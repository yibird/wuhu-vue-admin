<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { Icon } from '@/components'
import { defaultDirectorySearchHistory } from '../../data'
import { useSearchHistory } from '../../composables/useSearchHistory'
import type {
  Contact,
  Conversation,
  DirectoryGroupItem,
  DirectoryItem,
  DirectoryUserItem,
  GroupCategory,
} from '../types'

type SearchTab = 'all' | 'user' | 'group'

const props = withDefaults(
  defineProps<{
    contacts?: Contact[]
    groups?: Conversation[]
    candidates?: DirectoryItem[]
  }>(),
  {
    contacts: () => [],
    groups: () => [],
    candidates: () => [],
  }
)

const emit = defineEmits<{
  addUser: [user: DirectoryUserItem]
  addGroup: [group: DirectoryGroupItem]
}>()

const open = defineModel<boolean>('open', { default: false })
const keyword = shallowRef('')
const submittedKeyword = shallowRef('')
const activeTab = shallowRef<SearchTab>('all')

const {
  records,
  expanded,
  visibleRecords,
  canToggle,
  addRecord,
  removeRecord,
  clearRecords,
  toggleExpanded,
} = useSearchHistory({
  storageKey: 'wuhu-chat-directory-search-history',
  initialRecords: defaultDirectorySearchHistory,
  collapsedCount: 5,
})

const searchTabs = [
  { key: 'all', label: '全部' },
  { key: 'user', label: '用户' },
  { key: 'group', label: '群聊' },
]

const categoryLabels: Record<GroupCategory, string> = {
  project: '项目协作',
  department: '部门沟通',
  interest: '兴趣交流',
  study: '学习成长',
  other: '其他',
}

const allDirectoryItems = computed<DirectoryItem[]>(() => {
  const items = new Map<string, DirectoryItem>()

  for (const contact of props.contacts) {
    items.set(`user:${contact.id}`, {
      id: contact.id,
      type: 'user',
      name: contact.name,
      avatar: contact.avatar,
      status: contact.status,
      title: contact.title,
      department: contact.department,
      tags: contact.tags,
    })
  }

  for (const group of props.groups) {
    items.set(`group:${group.id}`, {
      id: group.id,
      type: 'group',
      name: group.title,
      avatar: group.avatar,
      category: group.groupInfo?.category,
      description: group.lastMessage,
      memberCount: group.groupInfo?.memberCount ?? 0,
    })
  }

  for (const candidate of props.candidates) {
    const key = `${candidate.type}:${candidate.id}`
    if (!items.has(key)) items.set(key, candidate)
  }

  return [...items.values()]
})

const addedUserIds = computed(
  () => new Set(props.contacts.map((item) => item.id))
)
const joinedGroupIds = computed(
  () => new Set(props.groups.map((item) => item.id))
)

const filteredResults = computed(() => {
  const normalized = submittedKeyword.value.trim().toLowerCase()
  if (!normalized) return []

  return allDirectoryItems.value.filter((item) => {
    if (activeTab.value !== 'all' && item.type !== activeTab.value) return false

    const searchFields =
      item.type === 'user'
        ? [item.name, item.title, item.department, ...(item.tags ?? [])]
        : [item.name, item.description, ...(item.tags ?? [])]

    return searchFields.some((field) =>
      field?.toLowerCase().includes(normalized)
    )
  })
})

watch(open, (isOpen) => {
  if (!isOpen) return
  keyword.value = ''
  submittedKeyword.value = ''
  activeTab.value = 'all'
})

watch(keyword, (value) => {
  if (!value.trim()) submittedKeyword.value = ''
})

function handleSearch(value?: string) {
  const nextKeyword = (typeof value === 'string' ? value : keyword.value).trim()
  if (!nextKeyword) return

  keyword.value = nextKeyword
  submittedKeyword.value = nextKeyword
  addRecord(nextKeyword)
}

function applyHistory(record: string) {
  handleSearch(record)
}

function isAdded(item: DirectoryItem) {
  return item.type === 'user'
    ? addedUserIds.value.has(item.id)
    : joinedGroupIds.value.has(item.id)
}

function resultActionLabel(item: DirectoryItem) {
  if (item.type === 'user') {
    return isAdded(item) ? '已是好友' : '添加好友'
  }
  return isAdded(item) ? '已加入' : '加入群聊'
}

function resultMeta(item: DirectoryItem) {
  if (item.type === 'user') {
    return [item.title, item.department].filter(Boolean).join(' · ') || '用户'
  }

  const category = item.category ? categoryLabels[item.category] : '群聊'
  return `${category} · ${item.memberCount} 人`
}

function handleAdd(item: DirectoryItem) {
  if (isAdded(item)) return
  if (item.type === 'user') {
    emit('addUser', item)
    return
  }
  emit('addGroup', item)
}
</script>

<template>
  <a-modal
    v-model:open="open"
    centered
    :destroy-on-hidden="true"
    :footer="null"
    :width="680"
  >
    <template #title>
      <div class="flex items-center gap-10">
        <span
          class="size-36 flex items-center justify-center rounded-8 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:user-round-search" :size="18" />
        </span>
        <div>
          <div class="text-lg text-main font-600">添加好友或群聊</div>
          <div class="mt-2 text-xs text-secondary font-400">
            搜索企业通讯录和公开群聊
          </div>
        </div>
      </div>
    </template>

    <div class="pt-6">
      <a-input-search
        v-model:value="keyword"
        size="large"
        allow-clear
        enter-button="搜索"
        placeholder="输入姓名、职位、部门或群名称"
        aria-label="搜索用户或群聊"
        @search="handleSearch"
      />

      <section
        v-if="records.length"
        class="border-b-1 border-color-1 border-b-solid py-14"
      >
        <div class="mb-9 flex items-center justify-between gap-10">
          <span class="text-sm text-main font-500">搜索记录</span>
          <div class="flex items-center gap-4">
            <button
              v-if="canToggle"
              type="button"
              class="button h-28 gap-4 rounded-4 px-7 text-xs text-secondary hover:(bg-hover text-primary)"
              @click="toggleExpanded"
            >
              {{ expanded ? '收起' : '展开全部' }}
              <Icon
                :name="
                  expanded ? 'i-lucide:chevron-up' : 'i-lucide:chevron-down'
                "
                :size="13"
              />
            </button>
            <a-popconfirm
              title="清空全部搜索记录？"
              ok-text="清空"
              cancel-text="取消"
              @confirm="clearRecords"
            >
              <button
                type="button"
                class="button size-28 rounded-4 text-secondary hover:(bg-hover text-error)"
                title="清空全部搜索记录"
                aria-label="清空全部搜索记录"
              >
                <Icon name="i-lucide:trash-2" :size="14" />
              </button>
            </a-popconfirm>
          </div>
        </div>

        <TransitionGroup
          name="history-item"
          tag="div"
          class="flex flex-wrap gap-7"
        >
          <span
            v-for="record in visibleRecords"
            :key="record"
            class="group h-30 flex items-center rounded-5 bg-fill-quaternary pl-9 text-xs text-secondary transition-colors hover:(bg-hover text-main)"
          >
            <button
              type="button"
              class="h-full max-w-140 truncate"
              :title="record"
              @click="applyHistory(record)"
            >
              {{ record }}
            </button>
            <button
              type="button"
              class="button size-26 rounded-4 text-placeholder opacity-65 transition-opacity hover:text-error group-hover:opacity-100"
              :title="`删除搜索记录 ${record}`"
              :aria-label="`删除搜索记录 ${record}`"
              @click="removeRecord(record)"
            >
              <Icon name="i-lucide:x" :size="12" />
            </button>
          </span>
        </TransitionGroup>
      </section>

      <a-tabs
        v-model:active-key="activeTab"
        class="directory-tabs"
        size="small"
        :animated="{ inkBar: true, tabPane: false }"
        :items="searchTabs"
      />

      <div class="min-h-300 max-h-400 overflow-y-auto pr-2">
        <a-empty
          v-if="!submittedKeyword || filteredResults.length === 0"
          class="py-70"
          :description="
            submittedKeyword ? '没有匹配的用户或群聊' : '暂无搜索结果'
          "
        />

        <TransitionGroup v-else name="directory-result" tag="div">
          <div
            v-for="item in filteredResults"
            :key="`${item.type}:${item.id}`"
            class="flex items-center gap-11 border-b-1 border-color-1 border-b-solid px-4 py-11 last:border-b-0"
          >
            <div class="relative shrink-0">
              <a-avatar
                :src="item.avatar"
                :size="44"
                round
                fallback-src="https://i.pravatar.cc/100?img=1"
              />
              <span
                class="absolute -bottom-2 -right-2 size-18 flex items-center justify-center rounded-full border-2 border-container text-white"
                :class="item.type === 'user' ? 'bg-primary' : 'bg-success'"
              >
                <Icon
                  :name="
                    item.type === 'user'
                      ? 'i-lucide:user-round'
                      : 'i-lucide:users-round'
                  "
                  :size="10"
                />
              </span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-7">
                <span class="truncate text-sm text-main font-500">
                  {{ item.name }}
                </span>
                <span
                  class="shrink-0 rounded-4 bg-fill-quaternary px-5 py-1 text-10px text-secondary"
                >
                  {{ item.type === 'user' ? '用户' : '群聊' }}
                </span>
              </div>
              <div class="mt-3 truncate text-xs text-secondary">
                {{ resultMeta(item) }}
              </div>
              <div
                v-if="item.type === 'group' && item.description"
                class="mt-3 truncate text-xs text-placeholder"
              >
                {{ item.description }}
              </div>
            </div>

            <a-button
              class="shrink-0"
              size="small"
              :type="isAdded(item) ? 'default' : 'primary'"
              :disabled="isAdded(item)"
              @click="handleAdd(item)"
            >
              <template #icon>
                <Icon
                  :name="
                    item.type === 'user'
                      ? 'i-lucide:user-plus'
                      : 'i-lucide:log-in'
                  "
                  :size="14"
                />
              </template>
              {{ resultActionLabel(item) }}
            </a-button>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.history-item-enter-active,
.history-item-leave-active,
.directory-result-enter-active,
.directory-result-leave-active {
  transition:
    opacity 160ms ease,
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.history-item-enter-from,
.history-item-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

.directory-result-enter-from,
.directory-result-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (prefers-reduced-motion: reduce) {
  .history-item-enter-active,
  .history-item-leave-active,
  .directory-result-enter-active,
  .directory-result-leave-active {
    transition-duration: 1ms;
  }
}
</style>
