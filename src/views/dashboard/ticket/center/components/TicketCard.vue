<script setup lang="ts">
import { computed } from 'vue'
import {
  getTicketCategoryMeta,
  getTicketPriorityMeta,
  getTicketStatusMeta,
} from '../data'
import type { TicketRecord } from '../types'

const props = defineProps<{
  ticket: TicketRecord
}>()

const emit = defineEmits<{
  open: [ticket: TicketRecord]
}>()

const categoryMeta = computed(() =>
  getTicketCategoryMeta(props.ticket.category)
)
const priorityMeta = computed(() =>
  getTicketPriorityMeta(props.ticket.priority)
)
const statusMeta = computed(() => getTicketStatusMeta(props.ticket.status))
const visibleTags = computed(() => props.ticket.tags.slice(0, 3))
const remainingTagCount = computed(() =>
  Math.max(0, props.ticket.tags.length - visibleTags.value.length)
)

function openTicket() {
  emit('open', props.ticket)
}
</script>

<template>
  <article
    class="group min-w-0 cursor-pointer overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)] outline-none transition-[border-color,box-shadow,transform] duration-motion-base hover:-translate-y-2 hover:border-primary/45 hover:shadow-[var(--w-shadow-elevated)] focus-visible:border-primary motion-reduce:transition-none motion-reduce:hover:transform-none"
    :aria-label="`查看工单：${props.ticket.subject}`"
    role="button"
    tabindex="0"
    @click="openTicket"
    @keydown.enter="openTicket"
    @keydown.space.prevent="openTicket"
  >
    <div class="flex min-w-0 items-start gap-12 p-14">
      <span
        class="size-44 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary transition-transform duration-motion-base group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transition-none"
      >
        <Icon :name="categoryMeta.icon" :size="21" />
      </span>

      <div class="min-w-0 flex-1 flex items-start gap-8">
        <div class="min-w-0 flex-1">
          <span class="truncate text-xs text-secondary">
            {{ props.ticket.id }}
          </span>

          <h3 class="mt-4 line-clamp-2 text-md text-main font-700">
            {{ props.ticket.subject }}
          </h3>
        </div>

        <a-tag :bordered="false" :color="statusMeta.color" class="m-0 shrink-0">
          <span class="inline-flex items-center gap-4">
            <Icon :name="statusMeta.icon" :size="12" />
            {{ statusMeta.label }}
          </span>
        </a-tag>
      </div>
    </div>

    <div class="px-14 pb-14">
      <p class="m-0 line-clamp-2 min-h-38 text-sm text-regular">
        {{ props.ticket.description }}
      </p>

      <div class="mt-12 flex min-h-24 flex-wrap items-center gap-6">
        <a-tag :bordered="false" :color="priorityMeta.color" class="m-0">
          {{ priorityMeta.label }}优先级
        </a-tag>
        <a-tag
          v-for="tag in visibleTags"
          :key="tag"
          :bordered="false"
          class="m-0"
        >
          {{ tag }}
        </a-tag>
        <span v-if="remainingTagCount > 0" class="text-xs text-secondary">
          +{{ remainingTagCount }}
        </span>
      </div>

      <div class="mt-12 flex items-center gap-6 text-xs text-secondary">
        <Icon :name="categoryMeta.icon" :size="13" />
        <span>{{ categoryMeta.label }}</span>
        <span class="text-placeholder">·</span>
        <span class="truncate">{{ props.ticket.environment }}</span>
      </div>
    </div>

    <footer
      class="flex min-w-0 items-center gap-10 border-t-1 border-color-2 border-t-solid px-14 py-11"
    >
      <span
        class="size-30 flex flex-none items-center justify-center rounded-full bg-fill text-xs text-main font-700"
      >
        {{ props.ticket.reporter.slice(-1) }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-xs text-main">
          {{ props.ticket.reporter }} · {{ props.ticket.contact }}
        </div>
        <div class="mt-2 truncate text-xs text-secondary">
          处理人：{{ props.ticket.assignee }}
        </div>
      </div>
      <div class="flex-none text-right text-xs text-secondary">
        <div>{{ props.ticket.updatedAt.slice(5) }}</div>
        <div class="mt-2 inline-flex items-center gap-4">
          <Icon name="i-lucide:message-circle" :size="12" />
          {{ props.ticket.replyCount }}
        </div>
      </div>
    </footer>
  </article>
</template>
