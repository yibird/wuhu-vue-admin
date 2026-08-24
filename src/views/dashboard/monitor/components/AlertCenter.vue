<script lang="ts" setup>
import Card from './Card.vue'
import type {
  AlertCenterEmits,
  AlertCenterProps,
  MonitorSeverity,
} from './types'

const props = defineProps<AlertCenterProps>()
const emit = defineEmits<AlertCenterEmits>()

const severityOptions = [
  { label: '全部', value: 'all' },
  { label: '严重', value: 'critical' },
  { label: '警告', value: 'warning' },
  { label: '通知', value: 'info' },
]

const severityMeta: Record<
  MonitorSeverity,
  { label: string; icon: string; class: string }
> = {
  critical: {
    label: '严重',
    icon: 'i-lucide:octagon-alert',
    class: 'bg-error-tint text-error',
  },
  warning: {
    label: '警告',
    icon: 'i-lucide:triangle-alert',
    class: 'bg-warning-tint text-warning',
  },
  info: {
    label: '通知',
    icon: 'i-lucide:info',
    class: 'bg-info-tint text-info',
  },
}

const filteredItems = computed(() => {
  if (props.activeSeverity === 'all') return props.items
  return props.items.filter((item) => item.severity === props.activeSeverity)
})

function handleSeverityChange(value: string | number) {
  emit('update:activeSeverity', value as MonitorSeverity | 'all')
}
</script>

<template>
  <Card
    v-if="props.loading"
    title="告警中心"
    icon="i-lucide:bell-ring"
    description="待处理事件与风险提示"
  >
    <div class="flex flex-col gap-10">
      <div
        v-for="item in 3"
        :key="item"
        class="rounded-8 border-1 border-solid border-color-2 p-12"
      >
        <a-skeleton active avatar :paragraph="{ rows: 2 }" />
        <div class="mt-10 flex justify-between gap-10">
          <a-skeleton-input active size="small" class="!w-90" />
          <a-skeleton-button active size="small" />
        </div>
      </div>
    </div>
  </Card>
  <Card
    v-else
    title="告警中心"
    icon="i-lucide:bell-ring"
    description="待处理事件与风险提示"
  >
    <template #extra>
      <a-segmented
        :value="activeSeverity"
        :options="severityOptions"
        @change="handleSeverityChange"
      />
    </template>

    <TransitionGroup
      tag="div"
      class="relative flex flex-col gap-10"
      enter-active-class="transition-[opacity,transform] duration-motion-moderate ease-motion-enter motion-reduce:transition-none"
      enter-from-class="-translate-y-6 scale-[0.985] opacity-0 motion-reduce:(translate-y-0 scale-100)"
      leave-active-class="absolute inset-x-0 transition-[opacity,transform] duration-motion-moderate ease-motion-enter motion-reduce:transition-none"
      leave-to-class="-translate-y-6 scale-[0.985] opacity-0 motion-reduce:(translate-y-0 scale-100)"
      move-class="transition-transform duration-motion-moderate ease-motion-enter motion-reduce:transition-none"
    >
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12 transition-[border-color,background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-2 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]) active:(translate-y-0 scale-[0.995]) motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      >
        <div class="flex items-start gap-10">
          <span
            :class="[
              'mt-1 size-32 flex shrink-0 items-center justify-center rounded-8',
              severityMeta[item.severity].class,
            ]"
          >
            <Icon :name="severityMeta[item.severity].icon" :size="17" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-8">
              <div class="truncate text-sm text-main font-700">
                {{ item.title }}
              </div>
              <span class="shrink-0 text-xs text-secondary">{{
                item.time
              }}</span>
            </div>
            <div class="mt-5 text-xs text-secondary leading-18px">
              {{ item.description }}
            </div>
            <div class="mt-10 flex items-center justify-between gap-10">
              <span class="truncate text-xs text-secondary">
                {{ item.source }}
              </span>
              <a-button size="small" @click="emit('resolve', item)">
                处理
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <a-empty
        v-if="filteredItems.length === 0"
        key="empty"
        class="py-24"
        description="暂无告警"
      />
    </TransitionGroup>
  </Card>
</template>
