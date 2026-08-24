<script setup lang="ts">
import { message } from 'antdv-next'
import { AnimatePresence, LayoutGroup, Motion, MotionConfig } from 'motion-v'
import { useLoading } from '@/composables'
import {
  cardListMotionAnimate,
  cardListMotionExit,
  cardListMotionInitial,
  cardListMotionTransition,
} from '@/styles'
import {
  TicketCreateDrawer,
  TicketDetailDrawer,
  TicketFilters,
  TicketSummary,
  TicketCard,
} from './components'
import { useTickets } from './composables/useTickets'
import { getTicketStatusMeta } from './data'
import type { TicketDraft, TicketRecord, TicketStatus } from './types'

const { isLoading } = useLoading({ delay: 240 })
const {
  createDrawerOpen,
  currentPage,
  detailDrawerOpen,
  filteredTickets,
  filters,
  hasFilters,
  selectedTicket,
  stats,
  addReply,
  createTicket,
  openCreateDrawer,
  openTicket,
  pageSize,
  paginatedTickets,
  resetFilters,
  updateStatus,
} = useTickets()

function paginationTotalText(total: number) {
  return `共 ${total} 条工单`
}

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
  <WView full>
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
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

      <main
        data-testid="ticket-center-scroll"
        class="min-h-0 flex-1 overflow-y-auto py-12"
      >
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6"
        >
          <div
            v-for="index in 8"
            :key="index"
            class="h-268 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <a-skeleton active :paragraph="{ rows: 5 }" />
          </div>
        </div>

        <a-empty
          v-else-if="paginatedTickets.length === 0"
          class="h-full min-h-360 flex flex-col items-center justify-center"
          description="没有符合条件的工单"
        >
          <a-button :disabled="!hasFilters" @click="resetFilters">
            清除筛选
          </a-button>
        </a-empty>

        <MotionConfig v-else reduced-motion="user">
          <LayoutGroup id="ticket-center-card-list">
            <AnimatePresence
              as="div"
              mode="popLayout"
              :initial="false"
              class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6"
            >
              <Motion
                v-for="ticket in paginatedTickets"
                :key="ticket.id"
                as="div"
                layout="position"
                :initial="cardListMotionInitial"
                :animate="cardListMotionAnimate"
                :exit="cardListMotionExit"
                :transition="cardListMotionTransition"
                class="min-w-0"
              >
                <TicketCard
                  class="h-full"
                  :ticket="ticket"
                  @open="openTicket"
                />
              </Motion>
            </AnimatePresence>
          </LayoutGroup>
        </MotionConfig>
      </main>

      <footer
        data-testid="ticket-center-pagination"
        class="flex flex-none justify-center border-t-1 border-color-2 border-t-solid bg-container px-12 py-10 sm:px-16"
      >
        <a-pagination
          v-if="!isLoading && filteredTickets.length > 0"
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :page-size-options="[8, 16, 24]"
          :show-total="paginationTotalText"
          :total="filteredTickets.length"
          show-size-changer
        />
        <span v-else class="text-xs text-secondary">暂无分页数据</span>
      </footer>

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
