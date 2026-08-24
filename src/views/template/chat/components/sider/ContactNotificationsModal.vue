<template>
  <Modal
    v-model:open="open"
    v-model:fullscreen="fullscreen"
    :footer="null"
    :width="820"
    centered
    draggable
    fullscreenable
  >
    <template #title>
      <div class="flex items-center gap-8">
        <span
          class="size-30 flex items-center justify-center rounded-6 bg-primary-tint text-primary"
        >
          <Icon name="i-lucide:bell-ring" :size="16" />
        </span>
        <span>联系人通知</span>
        <a-badge :count="totalUnreadCount" :overflow-count="99" size="small" />
      </div>
    </template>

    <div
      class="min-h-0 flex flex-col"
      :class="fullscreen ? 'h-[calc(100vh-132px)]' : 'h-[min(68vh,620px)]'"
    >
      <div
        class="grid shrink-0 gap-10 border-b-1 border-b-solid border-color-1 pb-12 md:grid-cols-[240px_minmax(0,1fr)_auto]"
      >
        <a-segmented
          v-model:value="category"
          block
          :options="categoryOptions"
          aria-label="通知类型"
        >
          <template #labelRender="{ value }">
            <span class="flex items-center justify-center gap-6">
              <Icon
                :name="
                  value === 'friend'
                    ? 'i-lucide:user-round-plus'
                    : 'i-lucide:messages-square'
                "
                :size="14"
              />
              <span>{{ value === 'friend' ? '好友通知' : '群聊通知' }}</span>
              <span class="text-xs opacity-65">
                {{ getCategoryCount(value) }}
              </span>
            </span>
          </template>
        </a-segmented>

        <a-input
          v-model:value="keyword"
          allow-clear
          placeholder="搜索通知内容"
          aria-label="搜索通知内容"
        >
          <template #prefix>
            <Icon name="i-lucide:search" :size="15" class="text-secondary" />
          </template>
        </a-input>

        <a-segmented
          v-model:value="statusFilter"
          :options="statusOptions"
          aria-label="通知状态"
        />
      </div>

      <div
        class="shrink-0 flex items-center justify-between border-b-1 border-b-solid border-color-1 px-2 py-10 text-xs"
      >
        <span class="text-secondary">
          共 {{ filteredNotifications.length }} 条通知
        </span>
        <div class="flex items-center gap-10">
          <span class="text-placeholder"> {{ pendingCount }} 条待处理 </span>
          <a-button
            type="link"
            size="small"
            :disabled="categoryUnreadCount === 0"
            @click="emit('read', category)"
          >
            全部已读
          </a-button>
        </div>
      </div>

      <VirtualList
        class="min-h-0 flex-1"
        :aria-label="category === 'friend' ? '好友通知列表' : '群聊通知列表'"
        :items="filteredNotifications"
        :estimate-size="126"
        :get-item-key="(notice) => notice.id"
      >
        <template #default="{ item: notice }">
          <div class="px-4 py-4">
            <article
              class="flex gap-12 rounded-6 border-1 border-color-1 border-solid bg-container p-12 transition-[border-color,background-color,box-shadow] duration-motion-base hover:(border-color-primary bg-hover shadow-all-sm)"
            >
              <a-badge dot :count="notice.unread ? 1 : 0">
                <a-avatar
                  :src="notice.avatar"
                  :size="44"
                  round
                  class="shrink-0"
                />
              </a-badge>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-12">
                  <div class="min-w-0">
                    <h3 class="m-0 truncate text-sm text-main font-600">
                      {{ notice.title }}
                    </h3>
                    <p class="m-0 mt-4 text-sm text-secondary leading-20px">
                      {{ notice.description }}
                    </p>
                  </div>
                  <span class="shrink-0 text-xs text-placeholder">
                    {{ notice.createdAt }}
                  </span>
                </div>

                <div class="mt-10 flex min-h-24 items-center justify-between">
                  <span
                    class="inline-flex items-center gap-5 text-xs"
                    :class="getStatusClass(notice.status)"
                  >
                    <Icon :name="getStatusIcon(notice.status)" :size="13" />
                    {{ getStatusText(notice.status) }}
                  </span>

                  <div v-if="notice.status === 'pending'" class="flex gap-8">
                    <a-button
                      size="small"
                      @click="emit('resolve', notice, false)"
                    >
                      忽略
                    </a-button>
                    <a-button
                      type="primary"
                      size="small"
                      @click="emit('resolve', notice, true)"
                    >
                      {{ category === 'friend' ? '同意申请' : '加入群聊' }}
                    </a-button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </template>

        <template #empty>
          <div class="h-full flex flex-col items-center justify-center gap-10">
            <Icon name="i-lucide:inbox" :size="38" class="text-placeholder" />
            <div class="text-center">
              <div class="text-sm text-main font-500">暂无匹配通知</div>
              <div class="mt-4 text-xs text-secondary">
                调整搜索词或状态筛选后重试
              </div>
            </div>
          </div>
        </template>
      </VirtualList>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import { Modal } from '@/components/modal'
import VirtualList from '../VirtualList.vue'
import type {
  ContactNotification,
  ContactNotificationCategory,
  ContactNotificationStatus,
} from '../types'

type NotificationStatusFilter = 'all' | 'pending' | 'processed'

const props = withDefaults(
  defineProps<{
    notifications?: ContactNotification[]
  }>(),
  {
    notifications: () => [],
  }
)

const emit = defineEmits<{
  read: [category: ContactNotificationCategory]
  resolve: [notification: ContactNotification, accepted: boolean]
}>()

const open = defineModel<boolean>('open', { default: false })
const category = defineModel<ContactNotificationCategory>('category', {
  default: 'friend',
})
const fullscreen = shallowRef(false)
const keyword = shallowRef('')
const statusFilter = shallowRef<NotificationStatusFilter>('all')
const categoryOptions = [
  { value: 'friend', label: '好友通知' },
  { value: 'group', label: '群聊通知' },
]
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'processed', label: '已处理' },
]

const categoryNotifications = computed(() =>
  props.notifications.filter((item) => item.category === category.value)
)
const filteredNotifications = computed(() => {
  let list = categoryNotifications.value
  if (statusFilter.value === 'pending') {
    list = list.filter((item) => item.status === 'pending')
  } else if (statusFilter.value === 'processed') {
    list = list.filter((item) => item.status !== 'pending')
  }

  const normalizedKeyword = keyword.value.trim().toLowerCase()
  if (!normalizedKeyword) return list
  return list.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedKeyword) ||
      item.description.toLowerCase().includes(normalizedKeyword)
  )
})
const pendingCount = computed(
  () =>
    categoryNotifications.value.filter((item) => item.status === 'pending')
      .length
)
const categoryUnreadCount = computed(
  () => categoryNotifications.value.filter((item) => item.unread).length
)
const totalUnreadCount = computed(
  () => props.notifications.filter((item) => item.unread).length
)

function getCategoryCount(value: string | number) {
  return props.notifications.filter((item) => item.category === value).length
}

function getStatusText(status: ContactNotificationStatus) {
  const labels: Record<ContactNotificationStatus, string> = {
    pending: '等待处理',
    accepted: '已处理',
    rejected: '已忽略',
  }
  return labels[status]
}

function getStatusIcon(status: ContactNotificationStatus) {
  const icons: Record<ContactNotificationStatus, string> = {
    pending: 'i-lucide:clock-3',
    accepted: 'i-lucide:circle-check',
    rejected: 'i-lucide:circle-minus',
  }
  return icons[status]
}

function getStatusClass(status: ContactNotificationStatus) {
  const classes: Record<ContactNotificationStatus, string> = {
    pending: 'text-warning',
    accepted: 'text-success',
    rejected: 'text-secondary',
  }
  return classes[status]
}
</script>
