<script setup lang="ts">
import { computed } from 'vue'
import {
  getTicketCategoryMeta,
  getTicketPriorityMeta,
  getTicketStatusMeta,
} from '../../data'
import type { TicketRecord } from '../../types'
import { slaStatusMeta } from '../data'
import type { TicketQueueKey, TicketQueueOption } from '../types'

const props = defineProps<{
  activeQueue: TicketQueueKey
  items: TicketRecord[]
  queueOptions: TicketQueueOption[]
  selectedId: string
}>()

const emit = defineEmits<{
  queueChange: [queue: TicketQueueKey]
  select: [ticket: TicketRecord]
}>()

const selectOptions = computed(() =>
  props.queueOptions.map((item) => ({
    label: `${item.label}（${item.count}）`,
    value: item.key,
  }))
)

function handleQueueChange(value: TicketQueueKey) {
  emit('queueChange', value)
}
</script>

<template>
  <aside
    class="min-h-0 flex flex-col border-r-1 border-color-2 border-r-solid bg-container max-lg:border-b-1 max-lg:border-b-solid max-lg:border-r-0"
  >
    <header
      class="flex flex-none items-center gap-8 border-b-1 border-color-2 border-b-solid px-10 py-9"
    >
      <a-select
        :value="activeQueue"
        class="min-w-0 flex-1"
        :options="selectOptions"
        @change="handleQueueChange"
      />
      <a-tooltip title="队列按优先级和最后更新时间排序">
        <span
          class="size-30 flex shrink-0 items-center justify-center text-secondary"
        >
          <Icon name="i-lucide:arrow-down-wide-narrow" :size="15" />
        </span>
      </a-tooltip>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <button
        v-for="ticket in items"
        :key="ticket.id"
        type="button"
        class="w-full border-b-1 border-color-2 border-b-solid border-l-3 border-l-transparent bg-transparent px-11 py-10 text-left transition-colors duration-150 hover:bg-hover motion-reduce:transition-none"
        :class="{
          'border-l-primary bg-selected': ticket.id === selectedId,
        }"
        @click="emit('select', ticket)"
      >
        <div class="flex items-center gap-7">
          <span class="min-w-0 flex-1 truncate text-xs text-secondary">
            {{ ticket.id }} · {{ ticket.reporter }}
          </span>
          <a-tag
            :bordered="false"
            :color="getTicketPriorityMeta(ticket.priority).color"
          >
            {{ getTicketPriorityMeta(ticket.priority).label }}
          </a-tag>
        </div>

        <div class="mt-6 line-clamp-2 text-sm text-main font-600 leading-6">
          {{ ticket.subject }}
        </div>

        <div class="mt-8 flex items-center gap-7 text-xs text-secondary">
          <span class="inline-flex min-w-0 items-center gap-4 truncate">
            <Icon
              :name="getTicketCategoryMeta(ticket.category).icon"
              :size="12"
            />
            {{ getTicketCategoryMeta(ticket.category).label }}
          </span>
          <span class="text-placeholder">·</span>
          <span>{{ getTicketStatusMeta(ticket.status).label }}</span>
        </div>

        <div class="mt-7 flex items-center justify-between gap-8 text-xs">
          <span class="min-w-0 truncate text-secondary">
            {{
              ticket.assignee === '待分配' ? '待分配处理人' : ticket.assignee
            }}
          </span>
          <span
            class="inline-flex shrink-0 items-center gap-4"
            :class="slaStatusMeta[ticket.slaStatus].textClass"
          >
            <Icon :name="slaStatusMeta[ticket.slaStatus].icon" :size="12" />
            {{ ticket.slaDueAt.slice(5) }}
          </span>
        </div>
      </button>

      <a-empty
        v-if="items.length === 0"
        class="my-32"
        description="当前队列没有工单"
      />
    </div>
  </aside>
</template>
