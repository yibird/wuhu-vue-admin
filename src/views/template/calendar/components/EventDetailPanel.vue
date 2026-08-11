<script setup lang="ts">
import type { CalendarEventDetail } from '../types'

defineProps<{
  selectedEvent: CalendarEventDetail | null
}>()

const emit = defineEmits<{
  deleteEvent: [event: CalendarEventDetail]
  editEvent: [event: CalendarEventDetail]
}>()
</script>

<template>
  <section class="rounded-8 border-1 border-color-2 border-solid bg-page p-12">
    <div class="mb-10 flex items-center gap-8 text-sm text-main font-700">
      <Icon name="i-lucide:panel-right" :size="15" />
      日程详情
    </div>

    <div v-if="selectedEvent" class="min-w-0">
      <div class="flex items-start gap-10">
        <span
          class="mt-6 size-10 flex-none rounded-full"
          :style="{ backgroundColor: selectedEvent.calendarColor }"
        ></span>
        <div class="min-w-0 flex-1">
          <div class="truncate text-15px text-main font-800">
            {{ selectedEvent.title }}
          </div>
          <div class="mt-4 text-xs text-secondary">
            {{ selectedEvent.time }}
          </div>
        </div>
      </div>

      <p class="m-0 mt-12 text-13px text-regular leading-6">
        {{ selectedEvent.description }}
      </p>

      <div class="mt-12 grid gap-8 text-12px">
        <div class="flex items-center gap-8 text-secondary">
          <Icon name="i-lucide:layers" :size="13" />
          {{ selectedEvent.calendarName }}
        </div>
        <div class="flex items-center gap-8 text-secondary">
          <Icon name="i-lucide:user-round" :size="13" />
          {{ selectedEvent.owner }}
        </div>
        <div class="flex items-center gap-8 text-secondary">
          <Icon name="i-lucide:map-pin" :size="13" />
          {{ selectedEvent.location }}
        </div>
      </div>

      <div class="mt-12 flex flex-wrap gap-6">
        <span
          class="inline-flex items-center gap-4 rounded-4 border-1 border-solid px-6 py-2 text-11px"
          :class="selectedEvent.status.className"
        >
          <Icon :name="selectedEvent.status.icon" :size="12" />
          {{ selectedEvent.status.label }}
        </span>
        <span
          class="inline-flex items-center gap-4 rounded-4 border-1 border-solid px-6 py-2 text-11px"
          :class="selectedEvent.priority.className"
        >
          <Icon :name="selectedEvent.priority.icon" :size="12" />
          {{ selectedEvent.priority.label }}优先级
        </span>
      </div>

      <div class="mt-14 grid grid-cols-2 gap-8">
        <a-button size="small" @click="emit('editEvent', selectedEvent)">
          编辑
        </a-button>
        <a-button
          danger
          size="small"
          @click="emit('deleteEvent', selectedEvent)"
        >
          删除
        </a-button>
      </div>
    </div>

    <a-empty v-else description="选择一个日程查看详情" />
  </section>
</template>
