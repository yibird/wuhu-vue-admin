<script setup lang="ts">
import type { KnowledgeSectionWorkspace } from '../types'

const props = defineProps<{
  section: KnowledgeSectionWorkspace
}>()

const recallQuery = shallowRef('如何配置审批流条件并限制审批人范围？')
const recallTopK = shallowRef(5)
const scoreThreshold = shallowRef(0.62)

const showRecallTester = computed(() => props.section.key === 'recall')

function getToneClass(
  tone: KnowledgeSectionWorkspace['metrics'][number]['tone']
) {
  const classMap = {
    default: 'text-main bg-fill-tertiary',
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
  }
  return classMap[tone ?? 'default']
}

function getToneLabel(
  tone: KnowledgeSectionWorkspace['metrics'][number]['tone']
) {
  const labelMap = {
    default: '稳定',
    primary: '重点',
    success: '良好',
    warning: '关注',
  }
  return labelMap[tone ?? 'default']
}

function getItemBorderClass(
  tone: KnowledgeSectionWorkspace['items'][number]['tone']
) {
  const classMap = {
    default: 'border-color-2',
    primary: 'border-primary/35',
    success: 'border-success/35',
    warning: 'border-warning/35',
  }
  return classMap[tone ?? 'default']
}
</script>

<template>
  <section class="min-w-0 space-y-12">
    <div
      class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
    >
      <div class="flex flex-wrap items-start justify-between gap-12">
        <div class="min-w-0 flex items-start gap-12">
          <span
            class="size-44 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary"
          >
            <Icon :name="props.section.icon" :size="22" />
          </span>
          <div class="min-w-0">
            <h1 class="m-0 text-lg text-main font-700">
              {{ props.section.title }}
            </h1>
            <p class="m-0 mt-5 max-w-760 text-sm text-regular">
              {{ props.section.subtitle }}
            </p>
          </div>
        </div>
        <div class="flex flex-none items-center gap-8">
          <a-button v-if="props.section.secondaryAction">
            {{ props.section.secondaryAction }}
          </a-button>
          <a-button type="primary">
            <template #icon>
              <Icon name="i-lucide:plus" />
            </template>
            {{ props.section.primaryAction }}
          </a-button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="metric in props.section.metrics"
        :key="metric.label"
        class="rounded-8 border-1 border-color-2 border-solid bg-container p-12"
      >
        <div class="mb-8 flex items-center justify-between gap-8">
          <span class="text-xs text-secondary">{{ metric.label }}</span>
          <span
            class="rounded-full px-7 py-2 text-xs"
            :class="getToneClass(metric.tone)"
          >
            {{ getToneLabel(metric.tone) }}
          </span>
        </div>
        <strong class="block text-xl text-main font-800">
          {{ metric.value }}
        </strong>
        <p class="m-0 mt-6 text-xs text-secondary">{{ metric.helper }}</p>
      </div>
    </div>

    <div
      v-if="showRecallTester"
      class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
    >
      <div class="mb-12 flex items-center justify-between gap-8">
        <div>
          <h2 class="m-0 text-md text-main font-700">召回调试台</h2>
          <p class="m-0 mt-3 text-xs text-secondary">
            通过 TopK、阈值和真实问法快速定位召回问题
          </p>
        </div>
        <a-tag color="blue" :bordered="false">Hybrid Search</a-tag>
      </div>
      <a-input-search
        v-model:value="recallQuery"
        enter-button="运行测试"
        placeholder="输入业务问法"
      />
      <div class="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="rounded-8 bg-page px-12 py-10">
          <div class="mb-8 flex items-center justify-between text-xs">
            <span class="text-secondary">TopK</span>
            <strong class="text-main">{{ recallTopK }}</strong>
          </div>
          <a-slider v-model:value="recallTopK" :min="1" :max="10" />
        </div>
        <div class="rounded-8 bg-page px-12 py-10">
          <div class="mb-8 flex items-center justify-between text-xs">
            <span class="text-secondary">最低得分</span>
            <strong class="text-main">{{ scoreThreshold.toFixed(2) }}</strong>
          </div>
          <a-slider
            v-model:value="scoreThreshold"
            :min="0"
            :max="1"
            :step="0.01"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_330px]">
      <section
        class="min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container"
      >
        <div
          class="flex items-center justify-between border-b-1 border-color-2 border-b-solid px-14 py-12"
        >
          <h2 class="m-0 text-md text-main font-700">工作项</h2>
          <a-button size="small" type="text">
            <template #icon>
              <Icon name="i-lucide:filter" />
            </template>
            筛选
          </a-button>
        </div>
        <div class="divide-y-1 divide-color-2 divide-solid">
          <article
            v-for="item in props.section.items"
            :key="item.title"
            class="border-l-3 border-l-solid p-14 transition-colors duration-motion-base hover:bg-hover"
            :class="getItemBorderClass(item.tone)"
          >
            <div class="flex items-start gap-12">
              <span
                class="size-38 flex flex-none items-center justify-center rounded-8"
                :class="getToneClass(item.tone)"
              >
                <Icon :name="item.icon" :size="19" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-8">
                  <h3 class="m-0 text-sm text-main font-700">
                    {{ item.title }}
                  </h3>
                  <a-tag class="m-0" :bordered="false">
                    {{ item.status }}
                  </a-tag>
                </div>
                <p class="m-0 mt-6 text-sm text-regular">
                  {{ item.description }}
                </p>
                <div class="mt-8 text-xs text-secondary">{{ item.meta }}</div>
              </div>
              <a-button type="text" size="small">
                <template #icon>
                  <Icon name="i-lucide:arrow-up-right" />
                </template>
              </a-button>
            </div>
          </article>
        </div>
      </section>

      <aside
        class="min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
      >
        <div class="mb-12 flex items-center justify-between gap-8">
          <h2 class="m-0 text-md text-main font-700">
            {{ props.section.insightTitle }}
          </h2>
          <Icon name="i-lucide:sparkles" class="text-primary" />
        </div>
        <div class="space-y-10">
          <div
            v-for="insight in props.section.insights"
            :key="insight.label"
            class="rounded-8 border-1 border-color-2 border-solid bg-page p-12"
          >
            <div class="mb-6 flex items-center justify-between gap-8">
              <span class="text-xs text-secondary">{{ insight.label }}</span>
              <strong class="text-sm text-main">{{ insight.value }}</strong>
            </div>
            <p class="m-0 text-xs text-regular">{{ insight.description }}</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
