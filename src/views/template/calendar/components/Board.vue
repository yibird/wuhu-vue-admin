<script setup lang="ts">
import { DayFlowCalendar } from '@dayflow/vue'
import type { UseCalendarAppReturn } from '@dayflow/core'

const {
  calendar,
  hasActiveFilters,
  visibleEventCount,
  loading = false,
} = defineProps<{
  calendar: UseCalendarAppReturn
  hasActiveFilters: boolean
  visibleEventCount: number
  loading?: boolean
}>()

defineEmits<{
  createEvent: []
}>()

const calendarRootRef = useTemplateRef<HTMLElement>('calendarRoot')
let dayFlowLocaleObserver: MutationObserver | null = null

function localizeDayFlowLabels() {
  const root = calendarRootRef.value
  if (!root) return

  // DayFlow 当前仍会固定输出英文 All day，这里同步为中文文案。
  root.querySelectorAll<HTMLElement>('.df-all-day-label').forEach((node) => {
    if (node.textContent?.trim() === 'All day') {
      node.textContent = '全天'
    }
  })
}

onMounted(async () => {
  await nextTick()
  localizeDayFlowLabels()
  const root = calendarRootRef.value
  if (!root) return

  dayFlowLocaleObserver = new MutationObserver(localizeDayFlowLabels)
  dayFlowLocaleObserver.observe(root, {
    childList: true,
    subtree: true,
  })
})

onUnmounted(() => {
  dayFlowLocaleObserver?.disconnect()
  dayFlowLocaleObserver = null
})
</script>

<template>
  <main ref="calendarRoot" class="calendar">
    <template v-if="loading">
      <div
        class="flex items-center justify-between gap-12 border-b-1 border-color-2 border-b-solid px-14 py-12"
      >
        <div>
          <a-skeleton-input active class="!w-112" />
          <a-skeleton-input active size="small" class="!mt-6 !w-240" />
        </div>
        <a-skeleton-button active />
      </div>
      <div class="min-h-0 flex-1 p-14">
        <a-skeleton active :paragraph="{ rows: 12 }" />
      </div>
    </template>
    <template v-else>
      <div
        class="flex items-center justify-between gap-12 border-b-1 border-color-2 border-b-solid px-14 py-12 max-md:flex-col max-md:items-start"
      >
        <div>
          <div class="flex items-center gap-8 text-sm text-main font-700">
            <Icon name="i-lucide:calendar-days" :size="16" />
            日程看板
          </div>
          <div class="mt-3 text-xs text-secondary">
            支持拖拽调整日程，分类筛选会同步影响日历显示。
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-8">
          <a-tag :bordered="false" color="processing">
            可见 {{ visibleEventCount }} 项
          </a-tag>
          <a-button @click="$emit('createEvent')">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            新建
          </a-button>
        </div>
      </div>

      <div class="relative min-h-0 flex-1">
        <DayFlowCalendar :calendar="calendar" />
        <div
          v-if="hasActiveFilters && visibleEventCount === 0"
          class="pointer-events-auto absolute inset-x-18 top-72 z-2 rounded-8 border-1 border-color-2 border-dashed bg-container/92 p-18 text-center shadow-[var(--w-shadow-elevated)] backdrop-blur-8"
        >
          <a-empty description="当前筛选下暂无日程">
            <template #image>
              <Icon
                name="i-lucide:calendar-x-2"
                class="text-secondary"
                :size="46"
              />
            </template>
          </a-empty>
          <div class="mt-8 text-xs text-secondary">
            可在右侧筛选区清空条件。
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped lang="less">
.calendar {
  @apply min-h-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container flex flex-col;

  box-shadow: var(--w-shadow-elevated);

  --df-calendar-height: calc(var(--calendar-content-height) - 62px);
  --df-color-background: rgb(var(--w-bg-container));
  --df-color-border: rgb(var(--w-border-color-2));
  --df-color-foreground: rgb(var(--w-text-main));
  --df-color-card: rgb(var(--w-bg-container));
  --df-color-card-foreground: rgb(var(--w-text-main));
  --df-color-hover: rgb(var(--w-bg-hover));
  --df-color-muted: rgb(var(--w-fill-quaternary));
  --df-color-muted-foreground: rgb(var(--w-text-muted));
  --df-color-primary: rgb(var(--w-color-primary));
  --df-color-primary-foreground: #fff;
  --df-color-secondary: rgb(var(--w-text-muted));
  --df-color-secondary-foreground: #fff;

  :deep(.df-calendar-container) {
    @apply h-full w-full border-none rounded-0 shadow-none;

    font-family: var(--w-font-family);
  }

  :deep(.df-event) {
    transition:
      transform var(--w-motion-duration-base) var(--w-motion-ease-standard),
      filter var(--w-motion-duration-base) var(--w-motion-ease-standard);
  }

  :deep(.df-event:hover) {
    filter: brightness(1.04);
    transform: translateY(-1px);
  }
}
</style>
