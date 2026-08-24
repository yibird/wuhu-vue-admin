<script setup lang="ts">
import { message } from 'antdv-next'
import {
  ticketCategoryOptions,
  ticketPriorityOptions,
  ticketStatusOptions,
} from '../center/data'
import type { TicketPriority } from '../center/types'
import TicketConversation from './components/TicketConversation.vue'
import TicketProperties from './components/TicketProperties.vue'
import TicketQueue from './components/TicketQueue.vue'
import { supportTeamOptions } from './data'
import { useTicketManagement } from './composables/useTicketManagement'
import type {
  TicketAssignment,
  TicketQueueKey,
  TicketResolution,
} from './types'

const {
  currentAgent,
  filters,
  hasFilters,
  queue,
  queueOptions,
  selectedTicket,
  selectedTicketId,
  stats,
  tickets,
  visibleTickets,
  acceptTicket,
  addInternalNote,
  addPublicReply,
  closeTicket,
  continueTicket,
  reopenTicket,
  resetFilters,
  resolveTicket,
  selectTicket,
  setWaiting,
  updateAssignment,
  updatePriority,
} = useTicketManagement()

const teamOptions = computed(() => [
  { label: '全部处理组', value: 'all' },
  ...supportTeamOptions,
])

const statItems = computed(() => [
  {
    key: 'pending',
    label: '待受理',
    value: stats.value.pending,
    icon: 'i-lucide:inbox',
    className: 'text-warning',
  },
  {
    key: 'processing',
    label: '处理中',
    value: stats.value.processing,
    icon: 'i-lucide:loader-circle',
    className: 'text-info',
  },
  {
    key: 'unassigned',
    label: '待分配',
    value: stats.value.unassigned,
    icon: 'i-lucide:user-round-plus',
    className: 'text-primary',
  },
  {
    key: 'breached',
    label: 'SLA 超时',
    value: stats.value.breached,
    icon: 'i-lucide:timer-off',
    className: 'text-error',
  },
])

function handleQueueChange(nextQueue: TicketQueueKey) {
  queue.value = nextQueue
}

function handleAssignment(assignment: TicketAssignment) {
  if (!updateAssignment(assignment)) return
  message.success('处理人已更新')
}

function handlePriority(priority: TicketPriority) {
  if (!updatePriority(priority)) return
  message.success('优先级与 SLA 已更新')
}

function handleAccept() {
  if (!acceptTicket()) return
  message.success('工单已受理')
}

function handleContinue() {
  if (!continueTicket()) return
  message.success('工单已恢复处理')
}

function handleWaiting(reason: string) {
  if (!setWaiting(reason)) return
  message.success('工单已转为等待用户')
}

function handleResolve(resolution: TicketResolution) {
  if (!resolveTicket(resolution)) return
  message.success('工单已标记为已解决')
}

function handleClose(reason: string) {
  if (!closeTicket(reason)) return
  message.success('工单已关闭')
}

function handleReopen() {
  if (!reopenTicket()) return
  message.success('工单已重新打开')
}

function handlePublicReply(content: string) {
  if (!addPublicReply(content)) return
  message.success('公开回复已发送')
}

function handleInternalNote(content: string) {
  if (!addInternalNote(content)) return
  message.success('内部备注已添加')
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="flex flex-none flex-wrap items-center justify-between gap-12 border-b-1 border-color-2 border-b-solid bg-container px-14 py-11 sm:px-18"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-7">
            <h1 class="mb-0 truncate text-lg text-main font-700">工单处理</h1>
            <a-tag :bordered="false" color="blue">客服工作台</a-tag>
          </div>
          <div class="mt-4 text-xs text-secondary">
            {{ tickets.length }} 条工单 · 当前处理人 {{ currentAgent }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-18 gap-y-8 sm:grid-cols-4">
          <div
            v-for="item in statItems"
            :key="item.key"
            class="flex min-w-74 items-center gap-7"
          >
            <Icon :name="item.icon" :size="15" :class="item.className" />
            <div>
              <div class="text-md text-main font-700 leading-none">
                {{ item.value }}
              </div>
              <div class="mt-3 text-xs text-secondary">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </header>

      <section
        class="flex flex-none flex-wrap items-center gap-8 border-b-1 border-color-2 border-b-solid bg-container px-10 py-9 sm:px-14"
      >
        <a-input
          v-model:value="filters.keyword"
          allow-clear
          class="w-full sm:w-240"
          placeholder="搜索编号、标题、提交人或处理人"
        >
          <template #prefix>
            <Icon name="i-lucide:search" :size="14" class="text-placeholder" />
          </template>
        </a-input>
        <a-select
          v-model:value="filters.status"
          class="w-116"
          :options="ticketStatusOptions"
        />
        <a-select
          v-model:value="filters.priority"
          class="w-116"
          :options="ticketPriorityOptions"
        />
        <a-select
          v-model:value="filters.category"
          class="w-116"
          :options="ticketCategoryOptions"
        />
        <a-select
          v-model:value="filters.team"
          class="w-132"
          :options="teamOptions"
        />
        <a-button :disabled="!hasFilters" @click="resetFilters">
          <template #icon><Icon name="i-lucide:rotate-ccw" /></template>
          重置
        </a-button>
        <span class="ml-auto text-xs text-secondary">
          当前队列 {{ visibleTickets.length }} 条
        </span>
      </section>

      <main
        class="min-h-0 flex-1 grid grid-cols-[310px_minmax(0,1fr)_300px] overflow-hidden max-xl:grid-cols-[300px_minmax(0,1fr)] max-lg:grid-cols-1 max-lg:overflow-y-auto"
      >
        <TicketQueue
          :active-queue="queue"
          class="max-lg:min-h-320"
          :items="visibleTickets"
          :queue-options="queueOptions"
          :selected-id="selectedTicketId"
          @queue-change="handleQueueChange"
          @select="selectTicket"
        />
        <TicketConversation
          class="max-lg:min-h-600"
          :current-agent="currentAgent"
          :ticket="selectedTicket"
          @internal-note="handleInternalNote"
          @public-reply="handlePublicReply"
        />
        <TicketProperties
          class="max-h-full max-xl:col-span-2 max-xl:max-h-480 max-lg:col-span-1 max-lg:max-h-none"
          :ticket="selectedTicket"
          @accept="handleAccept"
          @assignment-change="handleAssignment"
          @close="handleClose"
          @continue="handleContinue"
          @priority-change="handlePriority"
          @reopen="handleReopen"
          @resolve="handleResolve"
          @waiting="handleWaiting"
        />
      </main>
    </div>
  </WView>
</template>
