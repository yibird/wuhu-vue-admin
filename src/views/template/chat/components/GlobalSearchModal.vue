<script setup lang="ts">
import { Icon } from '@/components'
import { useSearchHistory } from '../composables/useSearchHistory'
import { useChatGlobalSearch } from '../composables/useChatGlobalSearch'
import type { MessageSearchResult } from '../composables/useChatGlobalSearch'
import { statusText } from '../utils'
import type {
  Contact,
  Conversation,
  GlobalSearchMessagePayload,
  GlobalSearchTab,
  Message,
} from './types'

const props = withDefaults(
  defineProps<{
    contacts?: Contact[]
    groups?: Conversation[]
    conversations?: Conversation[]
    messagesByConversation?: Record<string, Message[]>
  }>(),
  {
    contacts: () => [],
    groups: () => [],
    conversations: () => [],
    messagesByConversation: () => ({}),
  }
)

const emit = defineEmits<{
  selectContact: [contact: Contact]
  selectGroup: [group: Conversation]
  selectMessage: [payload: GlobalSearchMessagePayload]
}>()

const open = defineModel<boolean>('open', { default: false })
const query = shallowRef('')
const activeTab = shallowRef<GlobalSearchTab>('all')

const {
  records,
  visibleRecords,
  canToggle,
  expanded,
  addRecord,
  removeRecord,
  clearRecords,
  toggleExpanded,
} = useSearchHistory({
  storageKey: 'wuhu-chat-global-search-history',
  initialRecords: ['项目进展', 'Alice', '产品研发群', '代码审查', '设计评审'],
  collapsedCount: 6,
})

const {
  activeResultCount,
  contactResults,
  groupResults,
  hasQuery,
  messageResults,
  resultCounts,
  resultSummary,
  scopeItems,
  searchTabs,
  visibleSections,
  groupMeta,
  messageSenderName,
} = useChatGlobalSearch({
  activeTab,
  contacts: () => props.contacts,
  conversations: () => props.conversations,
  groups: () => props.groups,
  messagesByConversation: () => props.messagesByConversation,
  query,
})

watch(open, (isOpen) => {
  if (!isOpen) return
  query.value = ''
  activeTab.value = 'all'
})

watch(query, (value) => {
  if (!value.trim()) activeTab.value = 'all'
})

function handleSearch(value?: string) {
  const keyword = (typeof value === 'string' ? value : query.value).trim()
  if (!keyword) return
  query.value = keyword
  addRecord(keyword)
}

function applyHistory(record: string) {
  query.value = record
  activeTab.value = 'all'
  addRecord(record)
}

function applyScope(tab: GlobalSearchTab) {
  activeTab.value = tab
}

function closeAfterPick() {
  if (query.value.trim()) addRecord(query.value)
  open.value = false
}

function handleSelectContact(contact: Contact) {
  closeAfterPick()
  emit('selectContact', contact)
}

function handleSelectGroup(group: Conversation) {
  closeAfterPick()
  emit('selectGroup', group)
}

function handleSelectMessage(result: MessageSearchResult) {
  closeAfterPick()
  emit('selectMessage', {
    conversation: result.conversation,
    message: result.message,
  })
}
</script>

<template>
  <a-modal
    v-model:open="open"
    centered
    :destroy-on-hidden="true"
    :footer="null"
    :width="820"
  >
    <template #title>
      <div class="flex items-center gap-10">
        <span
          class="size-38 flex items-center justify-center rounded-8 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:search" :size="19" />
        </span>
        <div class="min-w-0">
          <div class="text-lg text-main font-600">全局搜索</div>
          <div class="mt-2 text-xs text-secondary font-400">
            搜索联系人、群聊和历史消息
          </div>
        </div>
      </div>
    </template>

    <div class="global-search-shell pt-6">
      <a-input-search
        v-model:value="query"
        size="large"
        allow-clear
        enter-button="搜索"
        placeholder="输入姓名、群名、职位、消息内容"
        aria-label="全局搜索联系人群聊和历史消息"
        @search="handleSearch"
      >
        <template #prefix>
          <Icon name="i-lucide:sparkles" :size="16" class="text-secondary" />
        </template>
      </a-input-search>

      <div class="mt-10 flex items-center justify-between gap-12 text-xs">
        <span class="text-secondary">{{ resultSummary }}</span>
        <span
          class="hidden shrink-0 items-center gap-4 rounded-4 bg-fill-quaternary px-7 py-3 text-placeholder sm:flex"
        >
          <Icon name="i-lucide:command" :size="12" />
          Ctrl / Cmd + K
        </span>
      </div>

      <div v-if="!hasQuery" class="mt-16 space-y-16">
        <section v-if="records.length">
          <div class="mb-9 flex items-center justify-between gap-10">
            <span class="text-sm text-main font-500">最近搜索</span>
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
                  title="清空搜索记录"
                  aria-label="清空搜索记录"
                >
                  <Icon name="i-lucide:trash-2" :size="14" />
                </button>
              </a-popconfirm>
            </div>
          </div>

          <TransitionGroup
            name="global-search-history"
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
                class="h-full max-w-160 truncate"
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

        <section>
          <div class="mb-9 text-sm text-main font-500">搜索范围</div>
          <div class="grid gap-10 sm:grid-cols-3">
            <button
              v-for="item in scopeItems"
              :key="item.key"
              type="button"
              class="global-search-scope"
              @click="applyScope(item.key)"
            >
              <span
                class="size-34 flex shrink-0 items-center justify-center rounded-8 bg-primary/10 text-primary"
              >
                <Icon :name="item.icon" :size="17" />
              </span>
              <span class="min-w-0 text-left">
                <span class="block truncate text-sm text-main font-500">
                  {{ item.label }}
                </span>
                <span class="mt-2 block truncate text-xs text-secondary">
                  {{ item.description }}
                </span>
              </span>
            </button>
          </div>
        </section>
      </div>

      <template v-else>
        <a-tabs
          v-model:active-key="activeTab"
          class="mt-10"
          size="small"
          :animated="{ inkBar: true, tabPane: false }"
          :items="searchTabs"
        />

        <div
          class="global-search-results min-h-360 max-h-520 overflow-y-auto pr-4"
        >
          <a-empty
            v-if="activeResultCount === 0"
            class="py-72"
            description="没有匹配的联系人、群聊或消息"
          />

          <TransitionGroup
            v-else
            name="global-search-result"
            tag="div"
            class="space-y-14"
          >
            <section v-if="visibleSections.contacts" key="contacts">
              <div class="global-search-section-title">
                <span>联系人</span>
                <span>{{ resultCounts.contacts }}</span>
              </div>
              <div class="space-y-6">
                <button
                  v-for="result in contactResults"
                  :key="`contact:${result.contact.id}`"
                  type="button"
                  class="global-search-result-item"
                  @click="handleSelectContact(result.contact)"
                >
                  <span class="relative shrink-0">
                    <a-avatar
                      :src="result.contact.avatar"
                      :size="42"
                      round
                      fallback-src="https://i.pravatar.cc/100?img=1"
                    />
                    <span
                      v-if="result.contact.status"
                      class="absolute bottom-0 right-0 size-9 rounded-full border-2 border-container"
                      :class="{
                        'bg-success': result.contact.status === 'online',
                        'bg-fill': result.contact.status === 'offline',
                        'bg-error': result.contact.status === 'busy',
                        'bg-warning': result.contact.status === 'away',
                      }"
                    />
                  </span>
                  <span class="min-w-0 flex-1 text-left">
                    <span class="flex min-w-0 items-center gap-6">
                      <span class="truncate text-sm text-main font-500">
                        {{ result.contact.name }}
                      </span>
                      <span class="global-search-badge">联系人</span>
                      <span class="text-xs text-secondary">
                        {{ statusText(result.contact.status) }}
                      </span>
                    </span>
                    <span class="mt-3 block truncate text-xs text-secondary">
                      {{ result.meta || result.contact.email || '企业联系人' }}
                    </span>
                    <span
                      v-if="result.tags.length"
                      class="mt-6 flex flex-wrap gap-5"
                    >
                      <span
                        v-for="tag in result.tags"
                        :key="tag"
                        class="rounded-4 bg-fill-quaternary px-5 py-1 text-10px text-secondary"
                      >
                        {{ tag }}
                      </span>
                    </span>
                  </span>
                  <Icon
                    name="i-lucide:message-circle"
                    :size="16"
                    class="shrink-0 text-placeholder"
                  />
                </button>
              </div>
            </section>

            <section v-if="visibleSections.groups" key="groups">
              <div class="global-search-section-title">
                <span>群聊</span>
                <span>{{ resultCounts.groups }}</span>
              </div>
              <div class="space-y-6">
                <button
                  v-for="group in groupResults"
                  :key="`group:${group.id}`"
                  type="button"
                  class="global-search-result-item"
                  @click="handleSelectGroup(group)"
                >
                  <span class="relative shrink-0">
                    <a-avatar
                      :src="group.avatar"
                      :size="42"
                      round
                      fallback-src="https://i.pravatar.cc/100?img=5"
                    />
                    <span
                      class="absolute -bottom-2 -right-2 size-18 flex items-center justify-center rounded-full border-2 border-container bg-success text-white"
                    >
                      <Icon name="i-lucide:users-round" :size="10" />
                    </span>
                  </span>
                  <span class="min-w-0 flex-1 text-left">
                    <span class="flex min-w-0 items-center gap-6">
                      <span class="truncate text-sm text-main font-500">
                        {{ group.title }}
                      </span>
                      <span class="global-search-badge">群聊</span>
                    </span>
                    <span class="mt-3 block truncate text-xs text-secondary">
                      {{ groupMeta(group) }}
                    </span>
                    <span class="mt-4 block truncate text-xs text-placeholder">
                      {{ group.lastMessage || '暂无最新消息' }}
                    </span>
                  </span>
                  <Icon
                    name="i-lucide:arrow-up-right"
                    :size="16"
                    class="shrink-0 text-placeholder"
                  />
                </button>
              </div>
            </section>

            <section v-if="visibleSections.messages" key="messages">
              <div class="global-search-section-title">
                <span>历史消息</span>
                <span>{{ resultCounts.messages }}</span>
              </div>
              <div class="space-y-6">
                <button
                  v-for="result in messageResults"
                  :key="`message:${result.conversation.id}:${result.message.id}`"
                  type="button"
                  class="global-search-result-item"
                  @click="handleSelectMessage(result)"
                >
                  <span
                    class="size-42 flex shrink-0 items-center justify-center rounded-8 bg-fill-quaternary text-secondary"
                  >
                    <Icon name="i-lucide:message-square-text" :size="18" />
                  </span>
                  <span class="min-w-0 flex-1 text-left">
                    <span class="flex min-w-0 items-center gap-6">
                      <span class="truncate text-sm text-main font-500">
                        {{ result.conversation.title }}
                      </span>
                      <span class="global-search-badge">消息</span>
                      <span class="shrink-0 text-xs text-placeholder">
                        {{ result.message.timestamp }}
                      </span>
                    </span>
                    <span class="mt-3 block truncate text-xs text-secondary">
                      {{ messageSenderName(result.message) }}
                    </span>
                    <span class="mt-4 block truncate text-sm text-regular">
                      {{ result.preview }}
                    </span>
                  </span>
                  <Icon
                    name="i-lucide:corner-down-right"
                    :size="16"
                    class="shrink-0 text-placeholder"
                  />
                </button>
              </div>
            </section>
          </TransitionGroup>
        </div>
      </template>
    </div>
  </a-modal>
</template>

<style scoped>
.global-search-shell {
  min-height: 420px;
}

.global-search-scope,
.global-search-result-item {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  background: rgb(var(--w-bg-fill-1) / 44%);
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.global-search-scope:hover,
.global-search-result-item:hover {
  background: rgb(var(--w-bg-hover));
  border-color: rgb(var(--w-color-primary) / 28%);
  box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
  transform: translateY(-1px);
}

.global-search-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 7px;
  font-size: 12px;
  font-weight: 600;
  color: rgb(var(--w-text-secondary));
}

.global-search-badge {
  flex-shrink: 0;
  padding: 1px 5px;
  font-size: 10px;
  line-height: 14px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border-radius: 4px;
}

.global-search-history-enter-active,
.global-search-history-leave-active,
.global-search-result-enter-active,
.global-search-result-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-enter);
}

.global-search-history-enter-from,
.global-search-history-leave-to,
.global-search-result-enter-from,
.global-search-result-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (prefers-reduced-motion: reduce) {
  .global-search-scope,
  .global-search-result-item,
  .global-search-history-enter-active,
  .global-search-history-leave-active,
  .global-search-result-enter-active,
  .global-search-result-leave-active {
    transition-duration: 1ms;
  }
}
</style>
