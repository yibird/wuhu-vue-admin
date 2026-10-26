<template>
  <a-border-beam :duration="8" :line-width="2" :size="140">
    <Card class="page-enter page-enter--5" title="热门榜单">
      <div
        class="relative overflow-hidden rounded-10 bg-warning/10 px-12 py-12 sm:px-14"
      >
        <span
          class="pointer-events-none absolute right-[-28px] top-[-42px] size-112 rounded-999 border-warning/12 border-solid [border-width:18px]"
          aria-hidden="true"
        ></span>
        <div class="relative z-1 flex items-start justify-between gap-10">
          <div class="min-w-0">
            <div class="flex items-center gap-7">
              <span
                class="size-26 flex shrink-0 items-center justify-center rounded-8 bg-warning text-xs text-primary font-800"
              >
                01
              </span>
              <span class="text-xs text-warning font-700">热度冠军</span>
            </div>
            <div class="mt-10 truncate text-md text-main font-800">
              {{ topItem.title }}
            </div>
            <div class="mt-3 flex items-center gap-6 text-xs text-secondary">
              <span>搜索热度</span>
              <span class="text-success font-700">{{ topItem.change }}</span>
            </div>
          </div>
          <div class="shrink-0 text-right">
            <div class="text-3xl text-main font-800">{{ topItem.value }}%</div>
            <div class="mt-2 text-xs text-secondary">热度指数</div>
          </div>
        </div>
        <div
          class="relative z-1 mt-12 h-7 overflow-hidden rounded-999 bg-white/60"
        >
          <div
            class="h-full origin-left rounded-999 [background-color:rgb(var(--w-color-warning))] transition-[width] duration-300 ease-[var(--w-motion-ease)] motion-reduce:transition-none"
            :style="{ width: `${topItem.value}%` }"
          ></div>
        </div>
      </div>

      <SlidingHighlight
        ref="highlightRef"
        :inset="4"
        pill-class-name="rounded-8 bg-hover"
        class="mt-10"
        role="list"
      >
        <div
          v-for="(item, index) in rankedItems"
          :key="item.id"
          class="group relative min-w-0 rounded-8 px-4 py-9 focus-visible:(outline-none inset-ring-1 inset-ring-primary/42) sm:px-6"
          tabindex="0"
          role="listitem"
          @focus="handleItemFocus"
          @blur="handleItemBlur"
        >
          <div
            class="flex items-center gap-10 transition-transform duration-200 ease-[var(--w-motion-ease)] group-hover:translate-x-3 group-focus-visible:translate-x-3 motion-reduce:(transform-none transition-none)"
          >
            <span
              :class="[
                'size-26 flex shrink-0 items-center justify-center rounded-8 text-xs font-800 transition-shadow duration-200 ease-[var(--w-motion-ease)] group-hover:(shadow-md shadow-primary/18) group-focus-visible:(shadow-md shadow-primary/18) motion-reduce:transition-none',
                index === 0
                  ? 'bg-primary/10 text-primary'
                  : index === 1
                    ? 'bg-info/10 text-info'
                    : 'bg-muted text-secondary',
              ]"
            >
              {{ String(index + 2).padStart(2, '0') }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-8">
                <span class="min-w-0 truncate text-sm text-main font-700">
                  {{ item.title }}
                </span>
                <span class="shrink-0 text-sm text-main font-800">
                  {{ item.value }}%
                </span>
              </div>
              <div class="mt-7 h-5 overflow-hidden rounded-999 bg-secondary">
                <div
                  class="h-full origin-left rounded-999 bg-primary transition-[filter,transform,width] duration-300 ease-[var(--w-motion-ease)] group-hover:(scale-y-122 [filter:saturate(1.18)]) group-focus-visible:(scale-y-122 [filter:saturate(1.18)]) motion-reduce:(transform-none transition-none)"
                  :style="{ width: `${item.value}%` }"
                ></div>
              </div>
            </div>
            <div
              class="flex shrink-0 items-center gap-3 text-xs font-700"
              :class="
                item.change.startsWith('-') ? 'text-warning' : 'text-success'
              "
            >
              <Icon
                :name="
                  item.change.startsWith('-')
                    ? 'i-lucide:trending-down'
                    : 'i-lucide:trending-up'
                "
                :size="13"
              />
              <span>{{ item.change }}</span>
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

const highlightRef = useTemplateRef<SlidingHighlightInstance>('highlightRef')

const items = [
  {
    id: 1,
    title: '飘柔洗发水',
    value: 90,
    change: '+12.4%',
  },
  {
    id: 2,
    title: '小米Su7',
    value: 87,
    change: '+9.8%',
  },
  {
    id: 3,
    title: '小米Yu7',
    value: 84,
    change: '+7.5%',
  },
  {
    id: 4,
    title: 'iphone17 Pro Max 256GB',
    value: 84,
    change: '+6.1%',
  },
  {
    id: 5,
    title: '三星盖乐世512GB',
    value: 82,
    change: '+4.9%',
  },
  {
    id: 6,
    title: '小米asdasdYu7',
    value: 76,
    change: '+3.2%',
  },
  {
    id: 7,
    title: '小米吹风机',
    value: 76,
    change: '+2.8%',
  },
  {
    id: 8,
    title: '兰博基尼',
    value: 72,
    change: '-1.3%',
  },
  {
    id: 9,
    title: '法拉利',
    value: 63.8,
    change: '-2.4%',
  },
]

const topItem = items[0]
const rankedItems = items.slice(1)

function handleItemFocus(event: FocusEvent) {
  highlightRef.value?.highlight(event.currentTarget as HTMLElement)
}

function handleItemBlur() {
  highlightRef.value?.clear()
}
</script>
