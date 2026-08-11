<script setup lang="ts">
import {
  ticketCategoryOptions,
  ticketPriorityOptions,
  ticketStatusOptions,
} from '../data'
import type { TicketCategory, TicketPriority, TicketStatus } from '../types'

defineProps<{
  hasFilters: boolean
  resultCount: number
}>()

const emit = defineEmits<{
  create: []
  reset: []
}>()

const keyword = defineModel<string>('keyword', { required: true })
const status = defineModel<'all' | TicketStatus>('status', { required: true })
const category = defineModel<'all' | TicketCategory>('category', {
  required: true,
})
const priority = defineModel<'all' | TicketPriority>('priority', {
  required: true,
})
</script>

<template>
  <section
    class="flex flex-none flex-wrap items-center gap-8 border-b-1 border-color-2 border-b-solid bg-container px-12 py-10 sm:px-16"
  >
    <a-input
      v-model:value="keyword"
      allow-clear
      class="w-full sm:w-240"
      placeholder="搜索编号、标题或提交人"
    >
      <template #prefix>
        <Icon name="i-lucide:search" :size="14" class="text-placeholder" />
      </template>
    </a-input>

    <a-select
      v-model:value="status"
      class="w-120"
      :options="ticketStatusOptions"
    />
    <a-select
      v-model:value="category"
      class="w-120"
      :options="ticketCategoryOptions"
    />
    <a-select
      v-model:value="priority"
      class="w-120"
      :options="ticketPriorityOptions"
    />

    <a-button :disabled="!hasFilters" @click="emit('reset')">
      <template #icon>
        <Icon name="i-lucide:rotate-ccw" />
      </template>
      重置
    </a-button>

    <span class="mr-auto text-xs text-secondary"> {{ resultCount }} 条 </span>

    <a-button type="primary" @click="emit('create')">
      <template #icon>
        <Icon name="i-lucide:plus" />
      </template>
      提交工单
    </a-button>
  </section>
</template>
