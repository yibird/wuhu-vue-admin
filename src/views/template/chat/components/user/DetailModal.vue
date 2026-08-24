<script setup lang="ts">
import { Icon } from '@/components/icon'
import { statusText } from '../../utils'
import type { UserInfo } from '../types'

interface DetailItem {
  label: string
  value?: string
  icon: string
  status?: boolean
}

interface Props {
  open: boolean
  user?: UserInfo | null
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
})

const emit = defineEmits<{
  close: []
  chat: [user: UserInfo]
}>()

const displayName = computed(() => props.user?.name || '未知用户')

const statusLabel = computed(() => statusText(props.user?.status) || '未知状态')

const positionLabel = computed(() => {
  if (!props.user) return '暂无职位信息'
  return (
    [props.user.title, props.user.department].filter(Boolean).join(' / ') ||
    '暂无职位信息'
  )
})

const userTags = computed(() => props.user?.tags ?? [])

const summaryItems = computed(() => [
  {
    label: '用户 ID',
    value: props.user?.id,
    icon: 'i-lucide:fingerprint',
  },
  {
    label: '当前状态',
    value: statusLabel.value,
    icon: 'i-lucide:activity',
    status: true,
  },
  {
    label: '最近活跃',
    value: props.user?.lastActiveAt,
    icon: 'i-lucide:clock-3',
  },
])

const contactItems = computed<DetailItem[]>(() =>
  compactItems([
    {
      label: '邮箱',
      value: props.user?.email,
      icon: 'i-lucide:mail',
    },
    {
      label: '手机号',
      value: props.user?.phone,
      icon: 'i-lucide:phone',
    },
    {
      label: '办公地点',
      value: props.user?.location,
      icon: 'i-lucide:map-pin',
    },
  ])
)

const workItems = computed<DetailItem[]>(() =>
  compactItems([
    {
      label: '职位',
      value: props.user?.title,
      icon: 'i-lucide:badge-check',
    },
    {
      label: '部门',
      value: props.user?.department,
      icon: 'i-lucide:building-2',
    },
    {
      label: '公司',
      value: props.user?.company,
      icon: 'i-lucide:briefcase-business',
    },
    {
      label: '加入时间',
      value: props.user?.joinedAt,
      icon: 'i-lucide:calendar-days',
    },
  ])
)

const profileItems = computed<DetailItem[]>(() =>
  compactItems([
    {
      label: '备注',
      value: props.user?.remark,
      icon: 'i-lucide:message-square-text',
    },
    {
      label: '简介',
      value: props.user?.bio,
      icon: 'i-lucide:user-round',
    },
  ])
)

const statusClass = computed(() => {
  switch (props.user?.status) {
    case 'online':
      return 'bg-success'
    case 'busy':
      return 'bg-error'
    case 'away':
      return 'bg-warning'
    case 'offline':
      return 'bg-fill'
    default:
      return 'bg-disabled'
  }
})

const statusTagColor = computed(() => {
  switch (props.user?.status) {
    case 'online':
      return 'success'
    case 'busy':
      return 'error'
    case 'away':
      return 'warning'
    default:
      return 'default'
  }
})

function compactItems(items: DetailItem[]) {
  return items.filter((item) => Boolean(item.value))
}
</script>

<template>
  <a-modal
    :open="open"
    title="用户详情"
    :footer="null"
    centered
    :width="620"
    :z-index="1200"
    @cancel="emit('close')"
  >
    <div v-if="user" class="flex flex-col gap-18 py-4">
      <div
        class="flex flex-wrap items-center gap-16 border-b-1 border-b-solid border-color-1 pb-16"
      >
        <div class="relative size-68 shrink-0">
          <a-avatar
            :src="user.avatar || 'https://i.pravatar.cc/100?img=1'"
            :size="68"
            round
          />
          <span
            class="absolute bottom-2 right-2 size-13 rounded-full border-2 border-container"
            :class="statusClass"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="truncate text-lg text-main font-600">
            {{ displayName }}
          </div>
          <div class="mt-4 truncate text-sm text-regular">
            {{ positionLabel }}
          </div>
          <div class="mt-8 flex flex-wrap items-center gap-6">
            <a-tag v-for="tag in userTags" :key="tag" color="blue">
              {{ tag }}
            </a-tag>
            <a-tag v-if="userTags.length === 0">暂无标签</a-tag>
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-8">
          <a-tag :color="statusTagColor" class="m-0">
            {{ statusLabel }}
          </a-tag>
          <a-button
            v-if="user.id !== 'me'"
            type="primary"
            @click="emit('chat', user)"
          >
            <template #icon>
              <Icon name="i-lucide:message-circle" :size="15" />
            </template>
            私聊
          </a-button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-10">
        <div
          v-for="item in summaryItems"
          :key="item.label"
          class="min-w-0 rounded-8 border-1 border-color-1 border-solid bg-fill-quaternary px-12 py-10"
        >
          <div class="flex items-center gap-6 text-xs text-secondary">
            <Icon :name="item.icon" :size="13" />
            <span>{{ item.label }}</span>
          </div>
          <a-tag v-if="item.status" :color="statusTagColor" class="mb-0 mt-6">
            {{ item.value || '未填写' }}
          </a-tag>
          <div v-else class="mt-6 truncate text-sm text-main font-500">
            {{ item.value || '未填写' }}
          </div>
        </div>
      </div>

      <section v-if="contactItems.length" class="flex flex-col gap-10">
        <div class="text-sm text-main font-600">联系方式</div>
        <div class="grid grid-cols-2 gap-10">
          <div
            v-for="item in contactItems"
            :key="item.label"
            class="user-detail-item"
          >
            <Icon :name="item.icon" :size="16" class="text-secondary" />
            <div class="min-w-0">
              <div class="text-xs text-secondary">{{ item.label }}</div>
              <div class="mt-3 truncate text-sm text-main">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="workItems.length" class="flex flex-col gap-10">
        <div class="text-sm text-main font-600">工作信息</div>
        <div class="grid grid-cols-2 gap-10">
          <div
            v-for="item in workItems"
            :key="item.label"
            class="user-detail-item"
          >
            <Icon :name="item.icon" :size="16" class="text-secondary" />
            <div class="min-w-0">
              <div class="text-xs text-secondary">{{ item.label }}</div>
              <div class="mt-3 truncate text-sm text-main">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="profileItems.length" class="flex flex-col gap-10">
        <div class="text-sm text-main font-600">聊天资料</div>
        <div class="flex flex-col gap-8">
          <div
            v-for="item in profileItems"
            :key="item.label"
            class="flex gap-10 rounded-8 bg-fill-quaternary p-12"
          >
            <Icon :name="item.icon" :size="16" class="mt-1 text-secondary" />
            <div class="min-w-0 flex-1">
              <div class="text-xs text-secondary">{{ item.label }}</div>
              <div
                class="mt-5 whitespace-pre-wrap text-sm text-main leading-20"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        v-if="!contactItems.length && !workItems.length && !profileItems.length"
        class="rounded-8 bg-fill-quaternary px-14 py-18 text-center text-sm text-regular"
      >
        暂无更多用户资料
      </div>

      <div
        class="grid grid-cols-[88px_minmax(0,1fr)] gap-x-12 gap-y-12 rounded-8 border-1 border-color-1 border-solid bg-fill-quaternary p-14 text-sm"
      >
        <span class="text-secondary">用户名称</span>
        <span class="truncate text-main">{{ displayName }}</span>

        <span class="text-secondary">在线状态</span>
        <a-tag :color="statusTagColor" class="m-0 w-fit">
          {{ statusLabel }}
        </a-tag>
      </div>
    </div>

    <a-empty v-else description="暂无用户资料">
      <template #image>
        <Icon name="i-lucide:user-round-x" :size="48" class="text-disabled" />
      </template>
    </a-empty>
  </a-modal>
</template>

<style scoped>
.user-detail-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  min-width: 0;
  padding: 12px;
  background-color: rgb(var(--w-bg-fill-4));
  border-radius: 8px;
}
</style>
