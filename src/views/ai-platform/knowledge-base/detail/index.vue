<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { knowledgeBaseResources } from '../data'
import SectionPanel from './components/SectionPanel.vue'
import Sidebar from './components/Sidebar.vue'
import { knowledgeNavItems, knowledgeSectionMap } from './data'
import type { KnowledgeDetailSectionKey } from './types'

const route = useRoute()
const router = useRouter()
const activeKey = shallowRef<KnowledgeDetailSectionKey>('documents')

const routeId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : undefined
)
const currentKnowledgeBase = computed(
  () =>
    knowledgeBaseResources.find((item) => item.id === routeId.value) ??
    knowledgeBaseResources[0]
)
const activeSection = computed(() => knowledgeSectionMap[activeKey.value])

const overviewStats = computed(() => [
  {
    label: currentKnowledgeBase.value?.metrics[0]?.label ?? '文档',
    value: currentKnowledgeBase.value?.metrics[0]?.value ?? '0',
    icon: 'i-lucide:files',
  },
  {
    label: currentKnowledgeBase.value?.metrics[1]?.label ?? '命中率',
    value: currentKnowledgeBase.value?.metrics[1]?.value ?? '0%',
    icon: 'i-lucide:target',
  },
  {
    label: currentKnowledgeBase.value?.metrics[2]?.label ?? '质量',
    value: currentKnowledgeBase.value?.metrics[2]?.value ?? '96',
    icon: 'i-lucide:shield-check',
  },
  {
    label: '更新时间',
    value: currentKnowledgeBase.value?.updatedAt.slice(5, 16) ?? '-',
    icon: 'i-lucide:clock-3',
  },
])

function goBack() {
  void router.push('/ai-platform/knowledge-base')
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex overflow-hidden bg-page">
      <Sidebar
        v-model:active-key="activeKey"
        :description="currentKnowledgeBase?.description ?? ''"
        :sections="knowledgeNavItems"
        :title="currentKnowledgeBase?.name ?? '知识库详情'"
      />

      <div class="min-w-0 flex-1 flex flex-col overflow-hidden">
        <header
          class="flex flex-none flex-wrap items-center justify-between gap-12 border-b-1 border-color-2 border-b-solid bg-container px-16 py-12"
        >
          <div class="min-w-0 flex items-center gap-12">
            <a-button type="text" @click="goBack">
              <template #icon>
                <Icon name="i-lucide:arrow-left" />
              </template>
            </a-button>
            <span
              class="size-42 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary"
            >
              <Icon
                :name="currentKnowledgeBase?.icon ?? 'i-lucide:library-big'"
              />
            </span>
            <div class="min-w-0">
              <h1 class="m-0 truncate text-lg text-main font-700">
                知识库工作台
              </h1>
              <p class="m-0 mt-3 truncate text-xs text-secondary">
                文档接入、分段治理、召回调试、标注评估和权限设置
              </p>
            </div>
          </div>

          <div class="flex flex-none items-center gap-8">
            <a-button>
              <template #icon>
                <Icon name="i-lucide:upload" />
              </template>
              导入
            </a-button>
            <a-button type="primary">
              <template #icon>
                <Icon name="i-lucide:refresh-cw" />
              </template>
              重建索引
            </a-button>
          </div>
        </header>

        <main class="min-h-0 flex-1 overflow-y-auto p-12 sm:p-16">
          <div
            class="mb-12 grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4"
          >
            <div
              v-for="stat in overviewStats"
              :key="stat.label"
              class="rounded-8 border-1 border-color-2 border-solid bg-container p-12"
            >
              <div class="flex items-center justify-between gap-8">
                <span class="text-xs text-secondary">{{ stat.label }}</span>
                <Icon :name="stat.icon" class="text-primary" />
              </div>
              <strong class="mt-8 block truncate text-xl text-main font-800">
                {{ stat.value }}
              </strong>
            </div>
          </div>

          <SectionPanel :section="activeSection" />
        </main>
      </div>
    </div>
  </WView>
</template>
