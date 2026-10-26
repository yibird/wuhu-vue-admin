<template>
  <a-border-beam :duration="8" :line-width="2" :size="140">
    <Card class="page-enter page-enter--6" title="异常预警">
      <template #extra>
        <span class="text-xs text-secondary tabular-nums">
          待处理
          <span class="text-error font-700">{{ pendingCount }}</span>
          / {{ alerts.length }} 条
        </span>
      </template>

      <SlidingHighlight
        ref="highlightRef"
        :inset="4"
        pill-class-name="rounded-8 bg-hover"
        role="list"
      >
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="relative min-w-0 rounded-8 px-4 py-10 focus-visible:(outline-none inset-ring-1 inset-ring-primary/42) sm:px-6"
          tabindex="0"
          role="listitem"
          @focus="handleItemFocus"
          @blur="handleItemBlur"
        >
          <div class="flex items-start gap-10">
            <span
              class="size-28 shrink-0 flex items-center justify-center rounded-8"
              :class="levelTone(alert.level).badge"
            >
              <Icon :name="alert.icon" :size="15" />
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-6">
                <span class="min-w-0 truncate text-sm text-main font-700">
                  {{ alert.title }}
                </span>
                <span
                  class="shrink-0 rounded-4 px-5 py-1 text-10px font-700"
                  :class="levelTone(alert.level).tag"
                >
                  {{ alert.levelLabel }}
                </span>
              </div>
              <div class="mt-4 truncate text-xs text-secondary">
                {{ alert.description }}
              </div>
            </div>

            <div class="shrink-0 flex flex-col items-end gap-5">
              <span class="text-xs text-muted">{{ alert.time }}</span>
              <a-button
                type="link"
                size="small"
                class="px-0!"
                :disabled="handled.has(alert.id)"
                @click="markHandled(alert.id)"
              >
                {{ handled.has(alert.id) ? '已处理' : '标记处理' }}
              </a-button>
            </div>
          </div>
        </div>
      </SlidingHighlight>
    </Card>
  </a-border-beam>
</template>

<script lang="ts" setup>
import { Card } from '@/components/card'
import { SlidingHighlight } from '@/components/sliding-highlight'
import type { SlidingHighlightInstance } from '@/components/sliding-highlight'

type AlertLevel = 'critical' | 'high' | 'medium'

interface RiskAlert {
  id: string
  /** 预警标题 */
  title: string
  /** 补充说明 */
  description: string
  /** 发生时间 */
  time: string
  /** 预警级别 */
  level: AlertLevel
  /** 级别文案 */
  levelLabel: string
  /** 图标名 */
  icon: string
}

const highlightRef = useTemplateRef<SlidingHighlightInstance>('highlightRef')

const alerts: RiskAlert[] = [
  {
    id: 'stock',
    title: '3 个 SKU 库存低于安全线',
    description: '飘柔洗发水 750ml、小米吹风机 Pro、兰博基尼车模',
    time: '12 分钟前',
    level: 'critical',
    levelLabel: '紧急',
    icon: 'i-lucide:package-x',
  },
  {
    id: 'order',
    title: '华东仓异常订单待复核',
    description: '同一收货地址 1 小时内产生 26 笔订单,疑似重复下单',
    time: '48 分钟前',
    level: 'high',
    levelLabel: '较高',
    icon: 'i-lucide:shield-alert',
  },
  {
    id: 'refund',
    title: '退款率环比上升 3.2%',
    description: '主要集中在智能家居类目,建议核查商品详情页描述',
    time: '3 小时前',
    level: 'high',
    levelLabel: '较高',
    icon: 'i-lucide:trending-down',
  },
  {
    id: 'sync',
    title: '广告投放数据同步延迟',
    description: '巨量引擎渠道最近一次同步失败,已重试 2 次',
    time: '今天 09:20',
    level: 'medium',
    levelLabel: '一般',
    icon: 'i-lucide:clock',
  },
]

const handled = shallowRef(new Set<string>())

const pendingCount = computed(() => alerts.length - handled.value.size)

/**
 * 级别对应的徽标与标签配色
 *
 * @param level 预警级别
 */
function levelTone(level: AlertLevel) {
  switch (level) {
    case 'critical':
      return {
        badge: 'bg-error/10 text-error',
        tag: 'bg-error/10 text-error',
      }
    case 'high':
      return {
        badge: 'bg-warning/10 text-warning',
        tag: 'bg-warning/10 text-warning',
      }
    default:
      return { badge: 'bg-info/10 text-info', tag: 'bg-info/10 text-info' }
  }
}

/**
 * 标记为已处理,仅本地状态(演示数据无写入接口)
 *
 * @param id 预警 id
 */
function markHandled(id: string) {
  handled.value = new Set([...handled.value, id])
}

const handleItemFocus = (event: FocusEvent) =>
  highlightRef.value?.highlight(event.currentTarget as HTMLElement)
const handleItemBlur = () => highlightRef.value?.clear()
</script>
