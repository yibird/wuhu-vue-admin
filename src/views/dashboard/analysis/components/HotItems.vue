<script lang="ts" setup>
import Card from './Card.vue'

const items = [
  {
    id: 1,
    title: '飘柔洗发水',
    value: 90,
    change: '+12.4%',
    fillClass: 'from-warning to-primary',
  },
  {
    id: 2,
    title: '小米Su7',
    value: 87,
    change: '+9.8%',
    fillClass: 'from-primary to-info',
  },
  {
    id: 3,
    title: '小米Yu7',
    value: 84,
    change: '+7.5%',
    fillClass: 'from-info to-success',
  },
  {
    id: 4,
    title: 'iphone17 Pro Max 256GB',
    value: 84,
    change: '+6.1%',
    fillClass: 'from-primary to-info',
  },
  {
    id: 5,
    title: '三星盖乐世512GB',
    value: 82,
    change: '+4.9%',
    fillClass: 'from-primary to-info',
  },
  {
    id: 6,
    title: '小米asdasdYu7',
    value: 76,
    change: '+3.2%',
    fillClass: 'from-primary to-info',
  },
  {
    id: 7,
    title: '小米吹风机',
    value: 76,
    change: '+2.8%',
    fillClass: 'from-info to-success',
  },
  {
    id: 8,
    title: '兰博基尼',
    value: 72,
    change: '-1.3%',
    fillClass: 'from-warning to-primary',
  },
  {
    id: 9,
    title: '法拉利',
    value: 63.8,
    change: '-2.4%',
    fillClass: 'from-warning to-primary',
  },
]
</script>

<template>
  <Card
    title="热门榜单"
    icon="i-lucide:trophy"
    description="当前热度排行"
    body-class="p-12"
  >
    <div class="flex flex-col gap-8">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="analysis-hot-item min-w-0 rounded-8 border-1 border-solid border-transparent bg-container-secondary p-10 transition-colors hover:(border-color-2 bg-hover)"
        tabindex="0"
      >
        <div class="mb-8 flex items-center gap-9">
          <span
            :class="[
              'h-24 w-24 flex shrink-0 items-center justify-center rounded-999 text-xs font-800',
              index === 0
                ? 'bg-warning text-white'
                : index < 3
                  ? 'bg-primary text-white'
                  : 'bg-fill-secondary text-secondary',
            ]"
          >
            {{ index + 1 }}
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-8">
              <span class="min-w-0 truncate text-sm text-main font-700">
                {{ item.title }}
              </span>
              <span class="shrink-0 text-xs text-main font-700">
                {{ item.value }}%
              </span>
            </div>
            <div class="mt-2 flex items-center justify-between gap-8">
              <span class="truncate text-xs text-secondary">搜索热度</span>
              <span
                class="shrink-0 text-xs"
                :class="
                  item.change.startsWith('-') ? 'text-warning' : 'text-success'
                "
              >
                {{ item.change }}
              </span>
            </div>
          </div>
        </div>
        <div class="h-6 overflow-hidden rounded-999 bg-fill-secondary">
          <div
            class="analysis-hot-progress h-full rounded-999 bg-gradient-to-r"
            :class="item.fillClass"
            :style="{ width: `${item.value}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.analysis-hot-item {
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.analysis-hot-item:hover,
.analysis-hot-item:focus-visible {
  box-shadow: 0 8px 20px rgb(var(--w-shadow-color) / 12%);
  transform: translateX(2px);
}

.analysis-hot-item:focus-visible {
  outline: none;
  border-color: rgb(var(--w-color-primary) / 40%);
}

.analysis-hot-progress {
  transform-origin: left center;
  transition:
    filter 160ms ease,
    transform 160ms ease,
    width 240ms ease;
}

.analysis-hot-item:hover .analysis-hot-progress,
.analysis-hot-item:focus-visible .analysis-hot-progress {
  filter: saturate(1.18);
  transform: scaleY(1.22);
}

@media (prefers-reduced-motion: reduce) {
  .analysis-hot-item,
  .analysis-hot-progress {
    transition: none;
  }

  .analysis-hot-item:hover,
  .analysis-hot-item:focus-visible,
  .analysis-hot-item:hover .analysis-hot-progress,
  .analysis-hot-item:focus-visible .analysis-hot-progress {
    transform: none;
  }
}
</style>
