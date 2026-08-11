<script setup lang="ts">
import { message } from 'antdv-next'
import { useLoading } from '@/composables'
import TicketCreateDrawer from '../components/TicketCreateDrawer.vue'
import TicketDetailDrawer from '../components/TicketDetailDrawer.vue'
import TicketFilters from '../components/TicketFilters.vue'
import TicketSummary from '../components/TicketSummary.vue'
import TicketTable from '../components/TicketTable.vue'
import { useTickets } from '../composables/useTickets'
import { getTicketStatusMeta } from '../data'
import type { TicketDraft, TicketRecord, TicketStatus } from '../types'

const { isLoading } = useLoading({ delay: 240 })
const {
  createDrawerOpen,
  detailDrawerOpen,
  filteredTickets,
  filters,
  hasFilters,
  selectedTicket,
  stats,
  tickets,
  addReply,
  createTicket,
  openCreateDrawer,
  openTicket,
  resetFilters,
  updateStatus,
} = useTickets()

function handleCreate(draft: TicketDraft) {
  const ticket = createTicket(draft)
  message.success(`工单 ${ticket.id} 已提交`)
}

function handleStatusChange(ticket: TicketRecord, status: TicketStatus) {
  const updated = updateStatus(ticket.id, status)
  if (!updated) return
  message.success(`工单已更新为${getTicketStatusMeta(status).label}`)
}

function handleReply(ticket: TicketRecord, content: string) {
  const updated = addReply(ticket.id, content)
  if (!updated) return
  message.success('回复已添加')
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="flex flex-none items-center justify-between gap-12 border-b-1 border-color-2 border-b-solid bg-container px-14 py-12 sm:px-18"
      >
        <div class="min-w-0">
          <h1 class="mb-0 truncate text-lg text-main font-700">工单中心</h1>
          <div class="mt-3 text-xs text-secondary">
            {{ tickets.length }} 条记录
          </div>
        </div>
        <a-button type="primary" @click="openCreateDrawer">
          <template #icon>
            <Icon name="i-lucide:plus" />
          </template>
          提交工单
        </a-button>
      </header>

      <TicketSummary :stats="stats" />

      <TicketFilters
        v-model:category="filters.category"
        v-model:keyword="filters.keyword"
        v-model:priority="filters.priority"
        v-model:status="filters.status"
        :has-filters="hasFilters"
        :result-count="filteredTickets.length"
        @create="openCreateDrawer"
        @reset="resetFilters"
      />

      <main class="min-h-0 flex-1 overflow-auto p-10 sm:p-14">
        <TicketTable
          :items="filteredTickets"
          :loading="isLoading"
          @open="openTicket"
        />
      </main>

      <TicketCreateDrawer
        v-model:open="createDrawerOpen"
        @submit="handleCreate"
      />
      <TicketDetailDrawer
        v-model:open="detailDrawerOpen"
        :ticket="selectedTicket"
        @reply="handleReply"
        @status-change="handleStatusChange"
      />
    </div>
  </WView>
</template>
