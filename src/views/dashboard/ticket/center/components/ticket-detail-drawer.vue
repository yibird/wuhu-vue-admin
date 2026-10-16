<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import {
  getTicketCategoryMeta,
  getTicketPriorityMeta,
  getTicketStatusMeta,
} from '../data'
import type { TicketActivityType, TicketRecord, TicketStatus } from '../types'

const props = defineProps<{
  ticket?: TicketRecord
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  reply: [ticket: TicketRecord, content: string]
  statusChange: [ticket: TicketRecord, status: TicketStatus]
}>()

const reply = shallowRef('')
const { width: viewportWidth } = useWindowSize()
const drawerSize = computed(() => Math.min(viewportWidth.value, 720))
const visibleActivities = computed(
  () =>
    props.ticket?.activities.filter(
      (activity) => activity.visibility !== 'internal'
    ) ?? []
)

const statusAction = computed(() => {
  if (!props.ticket) return undefined

  const actionMap: Partial<
    Record<
      TicketStatus,
      { label: string; status: TicketStatus; icon: string; danger?: boolean }
    >
  > = {
    resolved: {
      label: '确认关闭',
      status: 'closed',
      icon: 'i-lucide:archive',
    },
    closed: {
      label: '重新打开',
      status: 'pending',
      icon: 'i-lucide:rotate-ccw',
    },
  }

  return actionMap[props.ticket.status]
})

watch(open, (value) => {
  if (value) reply.value = ''
})

function activityColor(type: TicketActivityType) {
  if (type === 'created') return 'blue'
  if (type === 'reply') return 'green'
  if (type === 'resolution') return 'green'
  return 'gray'
}

function changeStatus() {
  if (!props.ticket || !statusAction.value) return
  emit('statusChange', props.ticket, statusAction.value.status)
}

function sendReply() {
  const content = reply.value.trim()
  if (!props.ticket || !content) return
  emit('reply', props.ticket, content)
  reply.value = ''
}
</script>

<template>
  <a-drawer v-model:open="open" :size="drawerSize" title="工单详情">
    <template v-if="ticket" #extra>
      <a-tag
        :bordered="false"
        :color="getTicketStatusMeta(ticket.status).color"
      >
        {{ getTicketStatusMeta(ticket.status).label }}
      </a-tag>
    </template>

    <template v-if="ticket">
      <header class="border-b-1 border-color-2 border-b-solid pb-16">
        <div class="flex flex-wrap items-center gap-8">
          <span class="text-xs text-secondary">{{ ticket.id }}</span>
          <a-tag
            :bordered="false"
            :color="getTicketPriorityMeta(ticket.priority).color"
          >
            {{ getTicketPriorityMeta(ticket.priority).label }}优先级
          </a-tag>
        </div>
        <h2 class="mb-0 mt-8 text-lg text-main font-700">
          {{ ticket.subject }}
        </h2>
      </header>

      <section
        class="grid grid-cols-2 gap-x-16 gap-y-14 border-b-1 border-color-2 border-b-solid py-16 sm:grid-cols-3"
      >
        <div>
          <div class="text-xs text-muted">问题类型</div>
          <div class="mt-5 inline-flex items-center gap-5 text-sm text-main">
            <Icon
              :name="getTicketCategoryMeta(ticket.category).icon"
              :size="14"
            />
            {{ getTicketCategoryMeta(ticket.category).label }}
          </div>
        </div>
        <div>
          <div class="text-xs text-muted">提交人</div>
          <div class="mt-5 text-sm text-main">{{ ticket.reporter }}</div>
        </div>
        <div>
          <div class="text-xs text-muted">处理人</div>
          <div class="mt-5 text-sm text-main">{{ ticket.assignee }}</div>
        </div>
        <div>
          <div class="text-xs text-muted">发生环境</div>
          <div class="mt-5 text-sm text-main">{{ ticket.environment }}</div>
        </div>
        <div>
          <div class="text-xs text-muted">联系方式</div>
          <div class="mt-5 truncate text-sm text-main">
            {{ ticket.contact }}
          </div>
        </div>
        <div>
          <div class="text-xs text-muted">创建时间</div>
          <div class="mt-5 text-sm text-main">{{ ticket.createdAt }}</div>
        </div>
      </section>

      <section class="border-b-1 border-color-2 border-b-solid py-16">
        <h3 class="mb-8 text-sm text-main font-600">问题描述</h3>
        <p class="mb-0 whitespace-pre-wrap text-sm text-regular leading-7">
          {{ ticket.description }}
        </p>
      </section>

      <section class="py-16">
        <div class="mb-14 flex items-center justify-between">
          <h3 class="mb-0 text-sm text-main font-600">处理记录</h3>
          <span class="text-xs text-secondary">
            {{ visibleActivities.length }} 条
          </span>
        </div>

        <a-timeline>
          <a-timeline-item
            v-for="activity in visibleActivities"
            :key="activity.id"
            :color="activityColor(activity.type)"
          >
            <div class="text-sm text-main">{{ activity.content }}</div>
            <div class="mt-3 text-xs text-secondary">
              {{ activity.actor }} · {{ activity.createdAt }}
            </div>
          </a-timeline-item>
        </a-timeline>
      </section>

      <section
        class="border-t-1 border-color-2 border-t-solid bg-main px-12 pb-10 pt-12"
      >
        <a-textarea
          v-model:value="reply"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :disabled="ticket.status === 'closed'"
          :maxlength="300"
          placeholder="补充问题信息或处理结果"
          show-count
        />
        <div class="mt-8 flex justify-end">
          <a-button
            type="primary"
            :disabled="ticket.status === 'closed' || !reply.trim()"
            @click="sendReply"
          >
            <template #icon>
              <Icon name="i-lucide:send" />
            </template>
            回复
          </a-button>
        </div>
      </section>
    </template>

    <a-empty v-else description="工单不存在" />

    <template v-if="ticket && statusAction" #footer>
      <div class="flex items-center justify-between gap-8">
        <span class="text-xs text-secondary">
          最后更新 {{ ticket.updatedAt }}
        </span>
        <a-button
          :danger="statusAction.danger"
          type="primary"
          @click="changeStatus"
        >
          <template #icon>
            <Icon :name="statusAction.icon" />
          </template>
          {{ statusAction.label }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
